'use client'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import styles from './css/login-register.module.css'
import User from '@/app/media/UserSVG'
import SendSVG from '@/app/media/SendSVG'
import { useState } from 'react'
import HgWait from '../uI/HgWait'
import CheckBoxButton from '../uI/CheckBoxButton'
import { registerData } from '@/app/utils/JsonManage'
import PassInput from '../uI/inputs/PassInput'

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/frst-register`;

export default function Reguister({ onWaitingChange }){
    const [button, setButton] = useState(false)
    const [conditios, setConditios] = useState(false)
    const [watingStatus, setWatingStatus] = useState(true)
    const [ret, setRet] = useState(true)
    const [message, setMessage] = useState({
        message:'',
        state: false
    })

    const handleRegister = async (e) => { 
        e.preventDefault()
        try {
            onWaitingChange(true)
            setWatingStatus(false)
            setMessage({ message: '', state: false })
            
            const formData = new FormData(e.target)
            const data = {
                email: formData.get('user'),
                pass: formData.get('pass')
            }
            const response = await axios.post(URI, { email: data.email })
            const res = response.data;
            if(response.status === 200){
                setMessage({ message: res.message, state: true })
                registerData({ AuthEmail:  data.email, AuthPass: data.pass, AuthTok: res.token })
                setRet(false)
            }
        } catch (exError) {
            if (exError.response) {
                if (exError.response.status === 404 || exError.response.status === 401) {
                    setMessage({
                        message: 'Correo o contraseña incorrectos.',
                        state: true
                    })
                } else {
                    setMessage({
                        message: 'Ocurrió un error. Inténtelo más tarde.',
                        state: true
                    })
                }
            } else {
                setMessage({
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
            {ret ? 
            <>
            {watingStatus ? (
                <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                    <form onSubmit={handleRegister} id={styles.form}>
                        <div className='group'>
                            <input type="email" name='user' placeholder='correo@proveedor.com' required className='grup-text'/>
                            <User/>
                        </div>
                        <PassInput />
                        <CheckBoxButton 
                            text="Leer los terminos y condiciones" 
                            onclick={handleDownload}
                            onlyChange={true}
                        />
                        {conditios ? 
                            <CheckBoxButton
                                text="he leido y acepto los terminos y condiciones" 
                                onclick={() => setButton(!button)} 
                            />
                            :
                            <CheckBoxButton
                                text="he leido y acepto los terminos y condiciones" 
                                notChange={true}
                            />
                        }
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
        </> : <>
            {message.state ? <p className='bright' style={{textAlign: "center"}}>{message.message}</p> : null}
        </>}
    </AnimatePresence>
    )
}