'use client'

import DropSVG from "@/app/media/DropSVG"
import styles from './css/all-taloids.module.css'
import { peticion } from "@/app/utils/Funtions"
import { useEffect, useState } from "react"

export default function AllTabloids() {
    const [data, setData] = useState([])
    const [drop, setDrop] = useState({}) // Para manejar qué tabloides están expandidos

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
                        <div>
                            oz aqui va el boton para agregar el pago al usuario en este caso al ser gratuito se añade directo
                        </div>
                    </div>
                ))
            ) : (
                <p id={styles.n}>Sin tabloides disponibles</p>
            )}
        </section>
    )
}