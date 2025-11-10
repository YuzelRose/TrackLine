'use client'
import styles from './css/confrim-register.module.css'
import ConfrimRegister from '../components/from/ConfrimRegister'
import { useState } from 'react'

export default function RegisterConfirm(){
    const [mensage, setMensage] = useState({
        message: null,
        state: null,
        wait: false
    })
    const changeState = (retState) => {
        if(retState)
            setMensage({
                message: retState.message,
                status: retState.status,
                wait: retState.wait
            })
    }

    return(
        <main id={styles.main}>
            <h2 id={styles.h2}>{mensage.wait? "Terminando" : "Terminemos"} tu registro</h2>
                <ConfrimRegister funtion={changeState} />
            {mensage.text ? <p>{mensage.text}</p> : null}
        </main>
    )
}