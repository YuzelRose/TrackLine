'use client'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import styles from './css/login-register.module.css'
import User from '@/app/media/userSVG'
import ClosedEye from '@/app/media/closedEyeSVG'
import Eye from '@/app/media/eyeSVG'
import SendSVG from '@/app/media/SendSVG'
import { useState } from 'react'
import HgWait from '../uI/hgWait'
import CheckBoxButton from '../uI/CheckBoxButton'

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/frst-register`;

export default function Reguister({ onWaitingChange }){
    const [button, setButton] = useState(false)
    const [conditios, setConditios] = useState(false)
    const [show, setShow] = useState(false)
    const [watingStatus, setWatingStatus] = useState(true)
    const [error, setError] = useState({
        message:'',
        state:false
    })

    const handleRegister = async (e) => { 
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
            const response = await axios.post(URI, { email: data.email })
            const res = response.data;
            if(res.response.status === 200){
                alert('Revisa tu correo para terminar tu registro')
                // genera un json con tok y pass que se destruya tras x tiempo
            }
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

    const handleDownload = () =>{
        if(conditios === false) {
            setConditios(true)
            window.open('/documents/Términos_y_Condiciones _de_Uso_Track_Line_04-11-2025.pdf', '_blank');
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
                <form onSubmit={handleRegister} id={styles.form}>
                    <span className={styles.group}>
                        <input type="email" name='user' placeholder='correo@proveedor.com' required className={styles.text} />
                        <User/>
                    </span>
                    <span className={styles.group}>
                        { show ? <>
                            <input type="text" name='pass' placeholder='Contraseña' required className={styles.text} />
                            <Eye onClick={() => setShow(!show)}/> 
                        </> : <>
                            <input type="password" name='pass' placeholder='Contraseña' required className={styles.text} />
                            <ClosedEye onClick={() => setShow(!show)}/>
                        </> }
                    </span>
                    <CheckBoxButton 
                    text="Descargar los terminos y condiciones" 
                    onclick={handleDownload}
                    onlychange={true}
                    />
                    <AnimatePresence>
                        {conditios && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: "hidden" }}
                            >
                                <CheckBoxButton
                                    text="Lei y acepto los terminos y condiciones" 
                                    onclick={() => setButton(!button)} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Botón de enviar con animación */}
                    <AnimatePresence>
                        {button && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                <button type='submit' className='button'>
                                    Enviar confirmación <SendSVG/>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
                {error.state ? <p title='ocultar' onClick={() => setError({state: false})} className='error-text'>{error.message}</p> : null}
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