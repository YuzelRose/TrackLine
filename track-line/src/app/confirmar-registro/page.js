'use client'
import ConfrimRegister from '../components/from/ConfrimRegister';
import styles from './css/confrim-register.module.css'
import { useState } from 'react'

export default function RegisterConfirm(){
    const [message, setMessage] = useState({ message: null, status: null });

    const handleRegisterResult = (resp) => {
        setMessage({ message: resp.message, status: resp.status });
    }

    return(
        <main id={styles.main}>
            <h2 id={styles.h2}>
                {message.status === 201 ? "¡Registro Completado!" : "Terminemos tu registro"}
            </h2>
            
            <ConfrimRegister onResult={handleRegisterResult} />
            
            {message.message && (
                <div className={`${styles.message} ${message.status === 201 ? styles.success : styles.error}`}>
                    {message.message}
                </div>
            )}
        </main>
    )
}