'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation';
import axios from 'axios'
import styles from './css/login.module.css'
import User from '@/app/media/userSVG'
import ClosedEye from '@/app/media/closedEyeSVG'
import Eye from '@/app/media/eyeSVG'
import LoginSVG from '@/app/media/loginSVG'
import BoxSVG from '@/app/media/boxSVG'
import BoxChekedSVG from '@/app/media/boxChekedSVG'
import { useState } from 'react'
import HgWait from '../uI/hgWait'
import { keepSession } from '@/app/utils/JsonManage'

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/login-attempt`;

export default function Login({ onWaitingChange }){
    const navigate = useRouter();
    const [show, setShow] = useState(false)
    const [check, setCheck] = useState(false)
    const [watingStatus, setWatingStatus] = useState(true)
    const [error, setError] = useState({
        message:'',
        state:false
    })

    const handleShow = () => {
        setShow(!show)
    }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        try {
            console.log(`Haciendo peticion a: ${URI}`);
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
                keepSession({AuthUserName: user.Nombre, AuthMail: user.Correo, Token: user.Token})
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
                    <span className={styles.group}>
                        <input type="email" name='user' placeholder='correo@proveedor.com' required className={styles.text} />
                        <User/>
                    </span>
                    <span className={styles.group}>
                        { show ? <>
                            <input type="text" name='pass' placeholder='Contraseña' required className={styles.text} />
                            <Eye onClick={handleShow}/> 
                        </> : <>
                            <input type="password" name='pass' placeholder='Contraseña' required className={styles.text} />
                            <ClosedEye onClick={handleShow}/>
                        </> }
                    </span>
                    <div id={styles.keep} onClick={() => setCheck(!check)}>
                        { check ? 
                            <BoxChekedSVG /> 
                        : 
                            <BoxSVG /> 
                        } Mantener sesión
                    </div>
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