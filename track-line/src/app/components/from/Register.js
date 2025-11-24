'use client'
import styles from './css/login-register.module.css'
import SendSVG from '@/app/media/SendSVG'
import HgWait from '../uI/HgWait'
import CheckBoxButton from '../uI/inputs/CheckBoxButton'
import PassInput from '../uI/inputs/PassInput'
import TextInput from '../uI/inputs/TextInput'
import { MAIN } from '../uI/inputs/jasonContentemts'
import { peticion } from '@/app/utils/Funtions'
import { useState } from 'react'
import { registerData } from '@/app/utils/JsonManage'
import { motion, AnimatePresence } from 'framer-motion'


export default function Reguister({ onWaitingChange }){
    const [memory, setMemory] = useState(false)
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
            const response = await peticion('user/frst-register', { email: data.email })
            if(response.httpStatus === 200){
                setMessage({ message: response.message, state: true })
                registerData({ AuthEmail:  data.email, AuthPass: data.pass, AuthTok: response.data.token })
                setRet(false)
            } else {
                setMemory(true)
                alert(response.message)
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
        } else {
            window.open('/documents/Términos_y_Condiciones _de_Uso_Track_Line_04-11-2025.pdf', '_blank');
        }
    }

    return(
        <AnimatePresence mode="wait">
            { ret ? 
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
                        <TextInput content={MAIN} width={"100%"}/>
                        <PassInput />
                        <CheckBoxButton 
                            text="Leer los terminos y condiciones" 
                            onclick={handleDownload}
                            onlyChange={true}
                            state={memory}
                        />
                        { !conditios ? 
                            <CheckBoxButton
                                text="he leido y acepto los terminos y condiciones" 
                                notChange={true}
                                state={memory}
                            />
                            :
                            <CheckBoxButton
                                text="he leido y acepto los terminos y condiciones" 
                                onclick={() => setButton(!button)} 
                                state={memory}
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