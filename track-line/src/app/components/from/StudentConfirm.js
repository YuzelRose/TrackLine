'use client'
import styles from './css/confrim-register.module.css'
import PassInput from '../uI/inputs/PassInput'
import TextInput from '../uI/inputs/TextInput'
import HgWait from '../uI/HgWait'
import { useEffect, useState } from "react"
import { STUDENTS } from '../uI/inputs/jasonContentemts'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { doRegisterNoPass, EndRegister } from '@/app/utils/JsonManage'
import { peticion } from '@/app/utils/Funtions'

export default function StudentConfirm({funtion = () => {}}) {
    const router  = useRouter()
    const searchParams = useSearchParams()    
    const [wait, setWait] = useState(false)
    const [data, setData] = useState({
        urlToken: null,
        json: null,
        state: false
    })
    const [base, setBase] = useState(STUDENTS)

    useEffect(() => { // Validacion de los datos y seteo de campos
        const urlToken = {
            token: searchParams.get('token'),
            relatedMail: searchParams.get('related-mail'),
            mail: searchParams.get('mail')
        }
        const json = doRegisterNoPass()
        const isValid = !!urlToken && !!json && json.Token === urlToken.token
        setData({
            urlToken: urlToken,
            json: json,
            state: isValid
        })
        if (!isValid) router.push('/')
        const updatedBase = base.map(item => 
            item.name === "Email"
                ? { ...item, value: urlToken.mail, read: true }
                : item
        )
        setBase(updatedBase)
    }, [searchParams, router])

    const getData = (formData) => { // Recepcion de informacion
        funtion({message: "Recabando tu información",status: true,})
        const requestData = {
            data: {
                name: formData.get('Name'),
                email: formData.get('Email'),
                pass: formData.get('Pass'),
                passConfirm: formData.get('PassConfirm'),
                curp: formData.get('CURP'),
                birth: formData.get('Birth'),
                relatedEmail: data.urlToken.relatedMail
            }

        }
        const retMessage = checkData({
            data: requestData.data, 
            pass: requestData.data.pass, 
            passConfirm: requestData.data.passConfirm,
            email: requestData.data.email,
            relatedEmail: requestData.data.relatedMail
        })
        if(retMessage) {
            funtion({ message: retMessage, status: true })
            return null
        } else return requestData
    }

    const checkData = (data) => { // Revisar la informacion
        if(!data.data) return "Error en la informacion"
        if(data.relatedEmail === data.email) return "Error en la informacion de los correos"
        if(data.pass !== data.passConfirm) return "Las contraseñas no coinciden"
        return false
    }

    const endRegister = async (e) => {
        e.preventDefault()
        try {
            setWait(true)
            funtion({ message: "Registrando sus datos", status: true })
            const requestData  = getData(new FormData(e.target))
            if(!requestData) {
                setWait(false)
                return
            }
            const response = await peticion('user/register-tutor-student', requestData)
            if(response.httpStatus === 201) {
                EndRegister()
                funtion({ message: "Pulse para regresar a la pagina principal", status: true, completed: true})
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
                    <p>Realice el registro en compañía de tu tutor:</p>
                    <div>
                        <PassInput name="Pass"/>
                        <PassInput name='PassConfirm' placeholder='Confirme su contraseña'/>
                    </div>
                </div>
                <div className={`group ${styles.bg} ${styles.fromContent}`}>
                    <h4>Sus datos:</h4>
                    <TextInput content={base} width={"50%"}/> 
                </div>
                <button type='submit' className='button'>Terminar</button>
            </form>
        )
    }
}