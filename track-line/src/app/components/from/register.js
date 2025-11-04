'use client'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import styles from './css/login.module.css'
import User from '@/app/media/userSVG'
import ClosedEye from '@/app/media/closedEyeSVG'
import Eye from '@/app/media/eyeSVG'
import RegisterSVG from '@/app/media/RegisterSVG'
import { useState } from 'react'
import HgWait from '../uI/hgWait'

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/frst-register`;

export default function Reguister({ onWaitingChange }){
    const [show, setShow] = useState(false)
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
        onWaitingChange(true)
        setWatingStatus(false)
        setError({ message: '', state: false })
        
        const formData = new FormData(e.target)
        const data = {
            user: formData.get('user'),
            pass: formData.get('pass')
        }
        
        await handleLogin(data) 
    }

    const handleLogin = async (data) => { 
        try {
            const response = await axios.post(URI, data, { 
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log('Login exitoso:', response.data)
        } catch (error) {
            console.error('Error:', error.response?.data)
            setError({
                message: error.response?.data?.message || 'Error en el login',
                state: true
            })
        } finally {
            setWatingStatus(true)
            onWaitingChange(false)
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
                    <span className={styles.group}>
                        { show ? <>
                            <input type="text" name='passconf' placeholder='Confirme su contraseña' required className={styles.text} />
                            <Eye onClick={handleShow}/> 
                        </> : <>
                            <input type="password" name='passconf' placeholder='Confirme su contraseña' required className={styles.text} />
                            <ClosedEye onClick={handleShow}/>
                        </> }
                    </span>
                    <button type='submit' className='button'>Registrarse <RegisterSVG/></button>
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