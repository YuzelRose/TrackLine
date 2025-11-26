'use client'

import DropSVG from "@/app/media/DropSVG"
import styles from './css/all-taloids.module.css'
import { peticion } from "@/app/utils/Funtions"
import { useEffect, useState } from "react"
import { getSession } from "@/app/utils/JsonManage"
import { useRouter } from "next/navigation"

export default function AllTabloids() { // si da el tiempo agregar un buscador
    const router = useRouter()
    const [data, setData] = useState([])
    const [drop, setDrop] = useState({})

    useEffect(() => {
        const getTabloids = async () => {
            try {
                const response = await peticion('tabloid/get-all')
                if(response.httpStatus === 200) {
                    setData(response.data.data || [])
                } else {
                    setData([])
                }
            } catch(error){
                console.error('Error:', error)
                alert(error)
            }
        }
        getTabloids()
    }, [])

    const addPay = async() => {
        try {
            const session = getSession()
        } catch (error) {
            console.error('Error:', error)
            alert(error)
        }
    }

    const addtab = async(id) => {
        try {
            const session = getSession()
            if(!session) router.push('/')
            else {
                const response = await peticion("tabloid/add-user", {
                    data: {
                        course: id,
                        email: session.Email
                    }
                })
                alert(response.message)
            }
        } catch (error) {
            console.error('Error:', error)
            alert(error)
        }
    }

    const toggleDrop = (tabId) => {
        setDrop(prev => ({
            ...prev,
            [tabId]: !prev[tabId]
        }))
    }

    return(
        <section id={styles.conteiner}>
            <h5 className={styles.title}>Nuestra selección de cursos:</h5>
            {data && data.length > 0 ? (
                data.map(tab => (
                    <div key={tab._id} className={styles.tabloid}>
                        <h5>{tab.Name}</h5>
                        <p>Pagos requeridos: {tab.requiredPayment?.length || "Gratuito"}</p>
                        {drop[tab._id] && (
                            <div className={styles.dropContent}>
                                <h4>Detalles completos:</h4>
                                <p>{tab.description}</p>
                            </div>
                        )}
                        <div 
                            onClick={() => toggleDrop(tab._id)} 
                            className={styles.drop}
                            title={drop? "Mostrar contenido" : " Ocultar contenido"}
                        >
                            <DropSVG style={{transform: drop[tab._id] ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
                        </div>
                        <div className={styles.buttonDiv}>
                            {tab.requiredPayment?.length > 0 ? 
                                <button className="button">
                                    Agregar Pago
                                </button>
                                : 
                                <button className="button" onClick={()=>addtab(tab._id)}>
                                    Ingresar al Curso
                                </button>
                            }
                        </div>
                    </div>
                ))
            ) : (
                <p id={styles.noData}>Sin tabloides disponibles</p>
            )}
        </section>
    )
}