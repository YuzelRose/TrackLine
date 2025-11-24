'use client'
import styles from './css/confrim-register.module.css'
import PassInput from '../uI/inputs/PassInput'
import DropList from '../uI/inputs/DropList'
import TextInput from '../uI/inputs/TextInput'
import HgWait from '../uI/HgWait'
import { doRegister, EndRegister, registerStudentData } from '../../utils/JsonManage'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { minDate18YO, peticion } from '@/app/utils/Funtions'
import { STUDENTS, TUTORFILDS, DROPUSERS } from '../uI/inputs/jasonContentemts'

export default function ConfrimRegister({funtion = () => {}}) {
    const router  = useRouter()
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
    const [mmry, setMemory] = useState(null)
    
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
            setMemory(selection.text)
            const baseConfig = selection.type === "student" ? [...STUDENTS] : [...TUTORFILDS];
            const updatedBase = baseConfig.map(item => 
                item.name === (selection.type === "tutor" ? "Tutor-Email" : "Email")
                    ? { ...item, value: data.json.Email, read: true }
                    : item
            )
            setTypeBase(updatedBase);
        }
    }

    const getData = (formData, type) => { // Recepcion de informacion
        funtion({message: "Recabando tu información",status: true,})
        let requestData = null
        if(type === "tutor") {
            requestData = {
                data: {
                    name: formData.get('Tutor-Name'),
                    email: formData.get('Tutor-Email'),
                    pass: formData.get('Pass'),
                    passConfirm: formData.get('PassConfirm'), 
                    curp: formData.get('Tutor-CURP'),
                    birth: formData.get('Tutor-Birth'),
                    phone: formData.get('Tutor-Phone'), 
                    relatedEmail: formData.get('Tutor-RelatedEmail'), 
                }
            }
            if(requestData.data.email === requestData.data.relatedEmail) {
                funtion({ message: 'Los correos no pueden ser idénticos', status: true })
                return null
            }
        } else {
            requestData = {
                data: {
                    name: formData.get('Name'),
                    email: formData.get('Email'),
                    pass: formData.get('Pass'),
                    passConfirm: formData.get('PassConfirm'),
                    curp: formData.get('CURP'),
                    birth: formData.get('Birth')
                }

            }
        }
        const retMessage = checkData({
            data: requestData.data, 
            pass: requestData.data.pass, 
            passConfirm: requestData.data.passConfirm, 
            birth: requestData.data.birth, 
            type: type
        })
        if(retMessage) {
            funtion({ message: retMessage, status: true })
            return null
        } else return requestData
    }

    const checkData = (data) => { // Revisar la informacion
        if(!data.data) return "Error en la informacion"
        if(data.pass !== data.passConfirm) return "Las contraseñas no coinciden"
        if (minDate18YO(data.birth))
            return data.type === "tutor"
                ? "Debe ser mayor de edad para ser tutor"
                : "Debe ser mayor de edad para registrarse sin un tutor"
        return false
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
                if(type.type === "tutor")
                    registerStudentData({
                        AuthEmail: requestData.data.relatedEmail, 
                        AuthTok: response.data.token
                    })
                funtion({ message: "Pulse para regresar a la pagina principal", status: true, completed: true, type: type.type})
            } else {
                setWait(false)
                funtion({ message: `Error inespertado: ${response.message}`, status: true, completed: null})
            }
        } catch(exError) {
            console.error('Error en registro:', exError)
            funtion({ message: 'Ocurrió un error. Inténtelo más tarde.', status: true })
            setWait(false)
        } 
    }

    if(wait){
        return(
            <div id={styles.wait} className='group'>
                <HgWait/>
            </div>
        )
    } else {
        return(
            <form onSubmit={endRegister} id={styles.form}>
                <div id={styles.passConfirm} className={`group ${styles.bg}`}>
                    <p>Confirme su contraseña:</p>
                    <div>
                        <PassInput name="Pass" value={data.json?.Pass || ''} onlyPass={true} read={true}/>
                        <PassInput name='PassConfirm' placeholder='Confirme su contraseña'/>
                    </div>
                </div>
                
                <div className={`group ${styles.bg}`}>
                    <p>Yo soy un:</p> 
                    <DropList 
                        info={DROPUSERS} 
                        text={mmry || "Tipo de cuenta"} 
                        onclick={handleSelect}
                    />
                </div>

                {type.state ?
                    <>
                        <div className={`group ${styles.bg} ${styles.fromContent}`}>
                            <h4>Sus datos:</h4>
                            <TextInput content={typeBase} width={"50%"}/> 
                        </div>
                        <button type='submit' className='button'>Terminar</button>
                    </>
                : null }
            </form>
        )
    }
}