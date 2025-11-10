'use client'
import axios from 'axios'
import styles from './css/login-register.module.css'
import User from '@/app/media/UserSVG'
import LoginSVG from '@/app/media/LoginSVG'
import HgWait from '../uI/HgWait'
import PassInput from '../uI/inputs/PassInput'
import CheckBoxButton from '../uI/CheckBoxButton'
import { useState } from 'react'
import { keepSession } from '@/app/utils/JsonManage'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/login-attempt`;

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
            const data = {
                email: formData.get('user'),
                Pass: formData.get('pass')
            }
            const response = await axios.post(URI, { email: data.email, pass: data.Pass });
            const user = response.data;
            if (check) {
                keepSession({AuthUserEmail: user.Email, Token: user.token})
            }
            navigate.push('/tabloid/main');
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
                    <div className='group'>
                        <input type='email' name='user' placeholder='correo@proveedor.com' required className='grup-text' />
                        <User/>
                    </div>
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