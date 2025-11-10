'use client'
import axios from 'axios'
import styles from './css/confrim-register.module.css'
import PassInput from '../uI/inputs/PassInput'
import DropList from '../uI/DropList'
import TextInput from '../uI/inputs/TextInput'
import HgWait from '../uI/HgWait'
import { doRegister, EndRegister } from '../../utils/JsonManage'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { minDate18YO } from '@/app/utils/Funtions'


const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
const URI = `${URI_START}/trckln/user/register-`;

export default function ConfrimRegister({funtion = () => {}}) {
    const router  = useRouter();
    const searchParams = useSearchParams()
    const [wait, setWait] = useState(false)
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
    const [typeBase, setTypeBase] = useState([...base])
    
    useEffect(() => {
        const urlToken = searchParams.get('token')
        const json = doRegister()
        const isValid = !!urlToken && !!json && json.Token === urlToken
        setData({
            urlToken: urlToken,
            json: json,
            state: isValid
        })
        if (!isValid) {
            router.push('/')
        } else {
            setTypeBase(prevBase => 
                prevBase.map(item => 
                    item.name === "Email" 
                        ? { ...item, value: json.Email, read: true }
                        : item
                )
            )
        }
    }, [searchParams, router])

    const handleSelect = (selection) => {
        if(selection) {
            setType({
                text: selection.text,
                type: selection.type,
                state: true
            })
            
            if(selection.type === "tutor") {
                setTypeBase(prevBase => 
                    prevBase.map(item => ({
                        ...item,
                        name: `tutor-${item.name}`
                    }))
                )
            } else {
                setTypeBase(prevBase => 
                    prevBase.map(item => ({
                        ...item,
                        name: item.name.replace('tutor-', '')
                    }))
                )
            }
        }
    }

    const endRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    
    try {
        let response;
        let data;
        
        funtion({
            text: "Recabando tu información",
            status: null,
            wait: true
        })

        const pass = formData.get('Pass');
        const passConfirm = formData.get('passConfirm');
        
        if (pass !== passConfirm) {
            funtion({
                text: "Las contraseñas no coinciden",
                status: null,
                wait: false
            })
            return; 
        }

        if(type.type === "tutor") {
            const birth = formData.get('tutor-Birth');
            if (!minDate18YO(birth)) {
                funtion({
                    text: "Debe ser mayor de edad para ser tutor",
                    status: null,
                    wait: false
                })
                return; 
            }

            data = {
                tutor: {
                    name: formData.get('tutor-Name'),
                    email: formData.get('tutor-Email'),
                    pass: pass,
                    pass2: passConfirm, 
                    curp: formData.get('tutor-CURP'),
                    birth: birth,
                    phone: formData.get('Phone'), 
                    relatedEmail: formData.get('RelatedEmail'), 
                },
                student: {
                    name: formData.get('Name'),
                    email: formData.get('Email'),
                    curp: formData.get('CURP'),
                    birth: formData.get('Birth')
                }
            }
            
            funtion({
                text: "Registrando sus datos",
                status: null,
                wait: true
            })
            
            response = await axios.post(`${URI}tutor`, data);
            
        } else {
            const birth = formData.get('Birth');
            if (!minDate18YO(birth)) {
                funtion({
                    text: "Debe ser mayor de edad para registrarse sin un tutor",
                    status: null,
                    wait: false
                })
                return; 
            }

            data = {
                name: formData.get('Name'),
                email: formData.get('Email'),
                pass: pass,
                pass2: passConfirm,
                curp: formData.get('CURP'),
                birth: birth
            }
            
            funtion({
                text: "Registrando sus datos",
                status: null,
                wait: true
            })
            
            response = await axios.post(`${URI}student`, data);
        }

        funtion({
            text: response.data.message,
            status: response.data.status,
            wait: false
        })
        
    } catch(exError) {
        if (exError.response) {
            if (exError.response.status === 404 || exError.response.status === 401) {
                funtion({
                    text: 'Correo o contraseña incorrectos.',
                    status: exError.response.status,
                    wait: false                        
                })
            } else {
                funtion({
                    text: 'Ocurrió un error. Inténtelo más tarde.',
                    status: null,
                    wait: false
                })
            }
        } else {
            funtion({
                text: 'Ocurrió un error. Inténtelo más tarde.',
                status: null,
                wait: false
            })
        }
    }
}
    return(
        <>
            { wait ? 
                <div id={styles.wait} className='group'>
                    <HgWait/>
                </div>
            :
                <form onSubmit={endRegister} id={styles.form}>
                    <div id={styles.passConfirm} className={`group ${styles.bg}`}>
                        <p>Confirme su contraseña:</p>
                        <div>
                            <PassInput name="Pass" value={data.json?.Pass || ''} onlyPass={true} read={true}/>
                            <PassInput name='PassConfirm' placeholder='Confirme su contraseña'/>
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
            }
        </>
    )
}