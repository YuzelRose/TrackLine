'use client'
import StudentConfirm from '@/app/components/from/StudentConfirm'
import styles from './css/student-confirm.module.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function StudentConfirmRegister() {
    const router  = useRouter();
    const [message, setMessage] = useState({
        message: null,
        status: null,
        completed: false,
    })
    const changeState = (res) => {
        if(res) {
            setMessage({
                message: res.message,
                status: res.status,
                completed: res.completed, 
            })
        }
    }

    return(
        <main id={styles.main}>
            <h2 id={styles.h2}>{message.wait? "Terminando" : "Terminemos"} tu registro</h2>
            {!message.completed?<StudentConfirm funtion={changeState} />: null}
            {message.status ? 
                (message.message === "Pulse para regresar a la pagina principal" ?  
                    <p onClick={() => router.push('/')} className='interactuable-text'>{message.message}</p> 
                    : <p>{message.message}</p>
                )
                : null
            }
        </main>
    )
}