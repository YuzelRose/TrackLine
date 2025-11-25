'use client'
import styles from './css/login-register.module.css'
import LoginSVG from '@/app/media/LoginSVG'
import HgWait from '../uI/HgWait'
import PassInput from '../uI/inputs/PassInput'
import TextInput from '../uI/inputs/TextInput'
import CheckBoxButton from '../uI/inputs/CheckBoxButton'
import { MAIN } from '../uI/inputs/jasonContentemts'
import { peticion } from '@/app/utils/Funtions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { keepSession, session } from '@/app/utils/JsonManage'
import { motion, AnimatePresence } from 'framer-motion'
import { HttpStatusCode } from 'axios'

export default function Login({ onWaitingChange }){
    const navigate = useRouter();
    const [check, setCheck] = useState(false)
    const [watingStatus, setWatingStatus] = useState(true)
    const [error, setError] = useState({
        message: '',
        state: false
    })
    const handleSubmit = async (e) => { 
        e.preventDefault()
        try {
            onWaitingChange(true)
            setWatingStatus(false)
            setError({ message: '', state: false })
            const formData = new FormData(e.target)
            const response = await peticion('user/login', {
                data: {
                    email: formData.get('user'),
                    pass: formData.get('pass')
                }
            })
            if(response.httpStatus === 200) {
                if (check) keepSession({AuthUserEmail: response.data.Email, Token: response.data.Token})
                else session({AuthUserEmail: response.data.Email, Token: response.data.Token})
                navigate.push('/main')
            } else setError({
                message: response.message,
                state: true
            })
        } catch (exError) {
            console.error("Error al iniciar sesión:", exError);
            if (exError.response) {
                if (exError.response.status === 404 || exError.response.status === 401) {
                    setError({
                        message: 'Correo o contraseña incorrectos.',
                        state: true
                    })
                } else {
                    setError({
                        message: 'Ocurrió un error. Inténtelo más tarde.',
                        state: true
                    })
                }
            } else {
                setError({
                    message: 'Ocurrió un error. Inténtelo más tarde.',
                    state: true
                })
            }
        } finally {
            onWaitingChange(false)
            setWatingStatus(true)
        }
    }

    return(
    <AnimatePresence mode="wait">
        {watingStatus ? (
            <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <form onSubmit={handleSubmit} id={styles.form}>
                    <TextInput content={MAIN} width={"100%"}/>
                    <PassInput />
                    <CheckBoxButton text="Mantener sesión" onclick={() => setCheck(!check)}/>
                    <button type='submit' className='button'>Ingresar <LoginSVG/></button>
                </form>
                {error.state ? <p title='ocultar' onClick={() => setError({state: false})} className='error-text'>{error.message}</p> : null}
                <p className='link'>¿Olvidaste tu contraseña?</p>
            </motion.div>
        ) : (
            <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <HgWait/>
            </motion.div>
        )}
    </AnimatePresence>
)
}