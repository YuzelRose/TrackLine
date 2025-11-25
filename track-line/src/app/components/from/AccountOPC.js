'use client'
import styles from './css/account-opc.module.css'
import TextForm from "../uI/inputs/TextInput"
import PassInput from "../uI/inputs/PassInput"
import LoginSVG from '@/app/media/LoginSVG'
import { CHGSTUDENTS, CHGTUTORFILDS, MAIN } from "../uI/inputs/jasonContentemts"
import { peticion } from '@/app/utils/Funtions'
import { useState } from 'react'
import HgWait from '../uI/HgWait'
import ArrowSVG from '@/app/media/ArrowSVG'
import { getSession, NUKE } from '@/app/utils/JsonManage'

export default function AccountOPC({type, email, relatedEmail=null}) {
    const [form, setForm] = useState(false)
    const [wait, setWait] = useState(false)
    const [formData, setFormData] = useState(null)
    const [actionType, setActionType] = useState('') // 'changeData', 'drop'

    const dropAcount = async(e) => {
        e.preventDefault()
        try {
            setActionType('drop')
            setForm(true)
        } catch (error) {
            alert(error)
        }
    }

    const changePass = async(e) => {
        e.preventDefault()
        try {
            const formDataObj = new FormData(e.target)
            setFormData({
                data: { 
                    pass: formDataObj.get('pass') 
                }
            })
            setActionType('changeData')
            setForm(true)
        } catch (error) {
            alert(error)
        }
    }

    const changeMail = async(e) => {
        e.preventDefault()
        try {
            const formDataObj = new FormData(e.target)
            setFormData({
                data: {
                    email: formDataObj.get('user')
                }
            })
            setActionType('changeData')
            setForm(true)
        } catch (error) {
            alert(error)
        }
    }

    const changeData = async(e) => {
        e.preventDefault()
        try {
            const formDataObj = new FormData(e.target)
            const changes = {
                data: {
                    name: formDataObj.get('Name'),
                    curp: formDataObj.get('CURP'),
                    birth: formDataObj.get('Birth')
                }
            }
            if (type === "tutor") {
                changes.data.phone = formDataObj.get('Phone')
            }
            setFormData(changes)
            setActionType('changeData')
            setForm(true)
        } catch (error) {
            alert(error)
        }
    }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        try {
            setWait(true)
            const logData = new FormData(e.target)
            const userEmail = logData.get('user')
            const session = getSession()
            const isValidStundent = relatedEmail && relatedEmail === session.Email
            const isValidTutor = !relatedEmail && session.Email === email
            const isValidUser =  isValidStundent || isValidTutor              
            if(!isValidUser) {
                alert("Ingrese el correo correcto para esta cuenta")
                return
            }
            let requestData = null
            if(isValidTutor) {
                requestData = {
                    data: {
                        email: userEmail,
                        pass: logData.get('pass')
                    },
                    changes: formData
                }
            } else {
                requestData = {
                    data: {
                        email: userEmail,
                        pass: logData.get('pass')
                    },
                    changes: formData
                }
            }
            let URI = 'user/change-data'
            if (actionType === 'drop')  URI = 'user/drop'

            const response = await peticion(URI, requestData)
            
            if(response.httpStatus === 200) {
                if (actionType === 'drop') {
                    if (session.Email === userEmail) {
                        NUKE()
                    }
                    window.location.href = '/'
                } else {
                    setForm(false)
                    setFormData(null)
                    setActionType('')
                    window.location.reload()
                }
            } else {
                alert(response.message || "Error al realizar la operación")
            }
        } catch (error) {
            console.error('Error:', error)
            alert(error.message || "Error inesperado")
        } finally {
            setWait(false)
        }
    }

    const renderForm = () => {
        if(wait) {
            return(
                <div id={styles.hgWrapper}>
                    <HgWait/>
                </div>
            )
        } else {
            return(
                <form onSubmit={handleSubmit} id={styles.form}>
                    <h4 
                        onClick={() => {
                            setForm(false)
                            setFormData(null)
                            setActionType('')
                        }}
                        title='Regresar'
                        style={{cursor: 'pointer'}}
                    >
                        <ArrowSVG rot={true}/> Volver
                    </h4>
                    <h5>Ingrese sus credenciales:</h5>
                    <TextForm content={MAIN} width={"100%"}/>
                    <PassInput />
                    <button type='submit' className='button'>
                        {actionType === 'drop' ? 'Eliminar cuenta' : 'Confirmar'} <LoginSVG/>
                    </button>
                </form>
            )
        }
    }

    const render = () => {
        switch(type) {
            case 'student':
                return <TextForm content={CHGSTUDENTS} width={"60%"}/>
            case 'tutor':
                return <TextForm content={CHGTUTORFILDS} width={"60%"}/>
            default:
                return null
        }
    }

    if(form) {
        return(
            <section id={styles.danger}>
                {renderForm()}
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
                    <TextForm content={MAIN} width={"100%"}/>
                </div>
                <button className={`${styles.button} ${styles.inbtn}`} type='submit'>
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