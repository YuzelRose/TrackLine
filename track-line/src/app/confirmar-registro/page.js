'use client'
import styles from './css/register-confirm.module.css'
import { doRegister, EndRegister } from '../utils/JsonManage'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import PassInput from '../components/uI/inputs/PassInput'
import DropList from '../components/uI/DropList'
import TextInput from '../components/uI/inputs/TextInput' 

export default function RegisterConfirm(){
    const router  = useRouter();
    const searchParams = useSearchParams()
    const [type, setType] = useState({
        text: null,
        type: null,
        state: false
    })
    const [data, setData] = useState({
        urlToken: null,
        json: null,
        state: false
    })
    const opc = [ 
        { id: 1, text: "Estudiante", type: "student" },
        { id: 2, text: "Tutor", type: "tutor" },
    ]
    const base = [
        {id: 1, name: "Name", placeholder: "Nombre", req: true},
        {id: 2, name: "Email", placeholder: "Correo", req: true, type: "email"},
        {id: 3, name: "CURP", placeholder: "CURP", req: true},
        {id: 4, name: "Birth", placeholder: "YYYY-MM-DD", req: true, text: "Fecha de nacimiento", type: "date"},
    ]
    const tutor = [
        {id: 1, name: "Phone", placeholder: "Telefono", req: true, type: "tel"},
        {id: 2, name: "RelatedEmail", placeholder: "Correo del estudiante", req: true, type: "email"},
    ]
    const [typeBase, setTypeBase] = useState(base)
    
    useEffect(() => {
        const urlToken = searchParams.get('token')
        const json = doRegister()
        const isValid = !!urlToken && !!json && json.Token === urlToken
        setData({
            urlToken: urlToken,
            json: json,
            state: isValid
        })
        if (json.Email) {
            setTypeBase(prevBase => 
                prevBase.map(item => 
                    item.name === "Email" 
                        ? { ...item, value: json.Email, red: true }
                        : item
                )
            )
            setTypeBase(prevBase => 
                prevBase.map(item => 
                    item.name === "Email" 
                        ? { ...item, value: json.Email, red: true }
                        : item
                )
            )
        }
        if (!isValid) {
            router.push('/')
        }
}, [searchParams, router])

    const handleSelect = (selection) => {
        if(selection)
            setType({
                text: selection.text,
                type: selection.type,
                state: true
            })
    }

    const endRegister = async () =>{

    }

    return(
        <main id={styles.main}>
            <h2>Terminemos tu registro</h2>
            <form onSubmit={endRegister} id={styles.form}>
                <div id={styles.passConfirm} className={`group ${styles.bg}`}>
                    <p>Confirme su contraseña:</p>
                    <div>
                        <PassInput value={data.json?.Pass || ''} onlyPass={true} red={true}/>
                        <PassInput name='passConfirm' placeholder='Confirme su contraseña'/>
                    </div>
                </div>
                
                <div className={`group ${styles.bg}`}>
                    <p>Yo soy un:</p> <DropList info={opc} text={"Tipo de cuenta"} onclick={handleSelect}/>
                </div>

                {type.state ?
                    <>
                        <div className={`group ${styles.bg} ${styles.fromContent}`}>
                            <h4>Sus datos:</h4>
                            <TextInput content={typeBase}/>
                            {type.type === "tutor" ? 
                                <TextInput content={tutor}/> 
                            : null }
                        </div>
                        {type.type === "tutor" ? 
                        <div className={`group ${styles.bg} ${styles.fromContent}`}>
                            <h4>Datos del alumno:</h4>
                            <TextInput content={base}/>                            
                        </div>
                        : null }
                        <button type='submit' className='button'>Terminar</button>
                    </>
                : null }
            </form>
        </main>
    )
}