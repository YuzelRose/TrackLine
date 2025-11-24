'use client'
import styles from './css/account-opc.module.css'
import TextForm from "../uI/inputs/TextInput"
import PassInput from "../uI/inputs/PassInput"
import LoginSVG from '@/app/media/LoginSVG'
import { CHGMAIL, CHGSTUDENTS, CHGTUTORFILDS, MAIN } from "../uI/inputs/jasonContentemts"
import { peticion } from '@/app/utils/Funtions'
import { useState } from 'react'

export default function AccountOPC({data}) {
    const [form, setForm] = useState(true)
    const [wait, setWait] = useState(false)

    const dropAcount = async(e) => {
        e.preventDefault()
        try {
            const res = await peticion('user/drop', {email: data.Email})
            if(res.httpStatus === 200) {
                alert('Su cuenta fue eliminada')
                window.location.href = '/' 
            } else alert("Intentelo de nuevo mas tarde")
        } catch (error) {
            alert(error)
        }
    }

    const changePass = async(e) => {
        e.preventDefault()
        try {
            const formData = new FormData(e.target)
            const requestData= {
                data: {
                    email: formData.get('user'),
                    pass: formData.get('pass')
                }
            }
            const res = await peticion('user/change-pass', requestData)
            if(res.httpStatus === 200) {
                alert('Su cuenta fue eliminada')
                window.location.href = '/' 
            } else alert("Intentelo de nuevo mas tarde")
        } catch (error) {
            alert(error)
        }
    }

    const changeMail = async(e) => {
        e.preventDefault()
        try {
            const res = await peticion('user/change-mail', requestData)
            if(res.httpStatus === 200) {
                alert('Su cuenta fue eliminada')
                window.location.href = '/' 
            } else alert("Intentelo de nuevo mas tarde")
        } catch (error) {
            alert(error)
        }
    }

    const changeData = async(e) => {
        e.preventDefault()
        try {
            const res = await peticion('user/change-data', requestData)
            if(res.httpStatus === 200) {
                alert('Su cuenta fue eliminada')
                window.location.href = '/' 
            } else alert("Intentelo de nuevo mas tarde")
        } catch (error) {
            alert(error)
        }
    }

    const render = () => {
        switch(data.UserType) {
        case 'student':
            return <TextForm content={CHGSTUDENTS} width={"60%"}/>
        case 'tutor':
            return <TextForm content={CHGTUTORFILDS} width={"60%"}/>
        default:
            return null // <TextForm content={CHGMAIL}/>
        }
    }

    const handleSubmit = async (e) => { 
            e.preventDefault()
            try {
                setWait(true)
                const formData = new FormData(e.target)
                const response = await peticion('user/login', {
                    data: {
                        email: formData.get('user'),
                        pass: formData.get('pass')
                    }
                })
            } catch (error) {
                alert(error)
            } finally {
                onWaitingChange(false)
                setWatingStatus(true)
            }
        }

    const renderForm = () => {
        if(wait) {
            return(
                <div id={styles.hg}>
                    <HgWait/>
                </div>
            )
        } else {
            <form onSubmit={handleSubmit} id={styles.form}>
                <TextForm content={MAIN} width={"100%"}/>
                <PassInput />
                <button type='submit' className='button'>Ingresar <LoginSVG/></button>
            </form>
        }
    }
    if(form) {
        return(
            <section id={styles.danger}>
                
            </section>
        )
    }
    return(
        <section id={styles.danger}>
            <h4>Opciones de cuenta:</h4>
            <form onSubmit={changeData} id={styles.changeData}>
                {render()}
                <button className={`${styles.button} ${styles.line}`} type='submit'>
                    Cambiar Informacion
                </button>
            </form>
            <form className={`${styles.in2} ${styles.in}`} onSubmit={changeMail}>
                <div>
                    <TextForm content={CHGMAIL}/>
                </div>
                <button className={`${styles.button} ${styles.inbtn}`}  type='submit'>
                    Cambiar correo
                </button>
            </form>
            <form className={`${styles.in2} ${styles.in}`} onSubmit={changePass}>
                <div>
                    <PassInput />
                </div>
                <button className={`${styles.button} ${styles.inbtn}`} type='submit'>
                    Cambiar contraseña
                </button>
            </form>
            <form id={styles.Drop} className={styles.in} onSubmit={dropAcount}>
                <button className={styles.button} type='submit'>
                    Eliminar cuenta
                </button>
            </form>
        </section>
    )
}