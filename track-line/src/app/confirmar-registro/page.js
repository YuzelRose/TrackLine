'use client'
import styles from './css/confrim-register.module.css'
import ConfrimRegister from '../components/from/ConfrimRegister'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterConfirm(){
    const router  = useRouter()
    const [mensage, setMensage] = useState({
        message: null,
        status: null,
        completed: false,
        type: null
    })
    const changeState = (res) => {
        if(res) {
            setMensage({
                message: res.message,
                status: res.status,
                completed: res.completed, 
                type: res.type
            })
        }
    }

    return(
        <main id={styles.main}>
            <h2 id={styles.h2}>{mensage.wait? "Terminando" : "Terminemos"} tu registro</h2>
            {!mensage.completed?
                <ConfrimRegister funtion={changeState} />
            : null}
            {mensage.status ? 
                (mensage.message === "Pulse para regresar a la pagina principal" ?  
                    <p onClick={() => router.push('/')} className='interactuable-text'>{mensage.message}</p> 
                    : <p>{mensage.message}</p>
                )
                : null
            }
            {mensage.type === "tutor" ?<p>Revise el correo del alumno</p> : null}
        </main>
    )
}