'use client'
import styles from './css/confrim-register.module.css'
import PassInput from '../uI/inputs/PassInput'
import DropList from '../uI/inputs/DropList'
import TextInput from '../uI/inputs/TextInput'
import HgWait from '../uI/HgWait'
import { doRegister, EndRegister } from '../../utils/JsonManage'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { minDate18YO, peticion } from '@/app/utils/Funtions'
import { STUDENTS, TUTORFILDS, DROPUSERS } from '../uI/inputs/jasonContentemts'

export default function ConfrimRegister({funtion = () => {}}) {
    const router  = useRouter();
    const searchParams = useSearchParams()
    const [wait, setWait] = useState(false)
    const [type, setType] = useState({
        text: null,
        type: null,
        state: false
    })
    const [data, setData] = useState({
        urlToken: null,
        json: null,
        state: false
    })
    const [typeBase, setTypeBase] = useState(null)
    
    useEffect(() => { // Validacion de los datos
        const urlToken = searchParams.get('token')
        const json = doRegister()
        const isValid = !!urlToken && !!json && json.Token === urlToken
        setData({
            urlToken: urlToken,
            json: json,
            state: isValid
        })
        if (!isValid) router.push('/')
    }, [searchParams, router])

    const handleSelect = (selection) => {
        if(selection) {
            setType({
                message: selection.text,
                type: selection.type,
                state: true
            })
            const baseConfig = selection.type === "student" ? [...STUDENTS] : [...TUTORFILDS];
            const updatedBase = baseConfig.map(item => 
                item.name === (selection.type === "tutor" ? "Tutor-Email" : "Email")
                    ? { ...item, value: data.json.Email, read: true }
                    : item
            );
            setTypeBase(updatedBase);
        }
    }

    const getData = (formData, type) => { // Recepcion de informacion
        funtion({message: "Recabando tu información",status: true,})
        let retMessage = null
        if(type === "tutor") {
            const requestData = {
                tutor: {
                    name: formData.get('Tutor-Name'),
                    email: formData.get('Tutor-Email'),
                    pass: formData.get('Pass'),
                    passConfirm: formData.get('PassConfirm'), 
                    curp: formData.get('Tutor-CURP'),
                    birth: formData.get('Tutor-Birth'),
                    phone: formData.get('Tutor-Phone'), 
                    relatedEmail: formData.get('Tutor-RelatedEmail'), 
                },
                student: {
                    name: formData.get('Name'),
                    email: formData.get('Email'),
                    curp: formData.get('CURP'),
                    birth: formData.get('Birth')
                }
            }
            retMessage = checkData(data, data.tutor.pass, data.tutor.passConfirm, data.tutor.birth, type)
            if(!retMessage) return requestData
        } else {
            const requestData = {
                data: {
                    name: formData.get('Name'),
                    email: formData.get('Email'),
                    pass: formData.get('Pass'),
                    passConfirm: formData.get('PassConfirm'),
                    curp: formData.get('CURP'),
                    birth: formData.get('Birth')
                }
            }
            retMessage = checkData(data, data.pass, data.passConfirm, data.birth, type)
            if(!retMessage) return requestData
        }
        if(retMessage) funtion({ message: retMessage, status: true })
        return null
    }

    const checkData = (data, pass, passConfirm, birth, type) => { // Revisar la informacion
        if(!data) return "Error en la informacion"
        if(pass !== passConfirm) return "Las contraseñas no coinciden"
        if (minDate18YO(birth))
            return type === "tutor"
                ? "Debe ser mayor de edad para ser tutor"
                : "Debe ser mayor de edad para registrarse sin un tutor"
        return null
    }

    const endRegister = async (e) => {
        e.preventDefault()
        try {
            setWait(true)
            funtion({ message: "Registrando sus datos", status: true })
            const requestData  = getData(new FormData(e.target), type.type)
            if(!requestData) {
                setWait(false)
                return
            }
            let response
            if(type.type === "tutor") { 
                response = await peticion('user/register-tutor', requestData)
            } else {
                response = await peticion('user/register-student', requestData)
            }
            if(response.httpStatus === 201) {
                EndRegister()
                funtion({ message: "Pulse para regresar a la pagina principal", status: true, completed: true})
            } else {
                setWait(false)
                funtion({ message: `Error inespertado :${response.status}`, status: true, completed: null})
            }
        } catch(exError) {
            console.error('Error en registro:', exError)
            funtion({ message: 'Ocurrió un error. Inténtelo más tarde.', status: true })
            setWait(false)
        } 
    }
    return(
        <>
            { wait ? 
                <div id={styles.wait} className='group'>
                    <HgWait/>
                </div>
            :
                <form onSubmit={endRegister} id={styles.form}>
                    <div id={styles.passConfirm} className={`group ${styles.bg}`}>
                        <p>Confirme su contraseña:</p>
                        <div>
                            <PassInput name="Pass" value={data.json?.Pass || ''} onlyPass={true} read={true}/>
                            <PassInput name='PassConfirm' placeholder='Confirme su contraseña'/>
                        </div>
                    </div>
                    
                    <div className={`group ${styles.bg}`}>
                        <p>Yo soy un:</p> <DropList info={DROPUSERS} text={"Tipo de cuenta"} onclick={handleSelect}/>
                    </div>

                    {type.state ?
                        <>
                            <div className={`group ${styles.bg} ${styles.fromContent}`}>
                                <h4>Sus datos:</h4>
                                <TextInput content={typeBase} width={"50%"}/> 
                            </div>
                            {type.type === "tutor" ? 
                            <div className={`group ${styles.bg} ${styles.fromContent}`}>
                                <h4>Datos del alumno:</h4>
                                <TextInput content={STUDENTS} width={"50%"}/>                            
                            </div>
                            : null }
                            <button type='submit' className='button'>Terminar</button>
                        </>
                    : null }
                </form>
            }
        </>
    )
}