'use client'
import { useEffect, useState } from 'react';
import styles from './css/tabloid-content.module.css'
import { useRouter } from 'next/navigation'
import DropSVG from '@/app/media/DropSVG';

export default function TabloidContent({data = [],type=''}) {
    const navigate = useRouter();    
    const [drop, setDrop] = useState(false)
    const [isNotice, setIsNotice] = useState(true)
 
    const handleOnClick = () => {
        if(type === "Tarea")
            navigate.push(`/tabloid/assigment?id=${data._id}`)
    }
    const handleDrop = (e) => {
        e.stopPropagation()
        setDrop(!drop)
    }

    useEffect(() => {
        if(type !== "Tarea"){
            setDrop(true)
            setIsNotice(false)
        }
    },[])

    return(
                <article 
                    onClick={handleOnClick} 
                    className={`${styles.conteiner} ${isNotice? styles.hw : null}`}
                    style={isNotice? {cursor: "pointer"} : {}}
                    title={isNotice? "Ir a la tarea" : null}
                >
                    <div className={styles.header}>
                        <h4>
                            {type}: {data.Name}
                        </h4>
                        <p>
                            Enviado el: {new Date(data.CreatedAt).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className={styles.content}>
                        {drop?
                            <div className={styles.dropContent}>
                                <p>{data.Content.value}</p>
                            </div>
                        : null }
                        {isNotice?
                        <span
                            title={drop? 'Pulse para minimizar' : 'Pulse para desplegar'}
                            className={styles.arrowWrapper}
                            onClick={handleDrop}
                            style={drop? { transform: 'rotate(180deg)' } : {}}

                        >
                            <DropSVG classStyle={styles.dropArrow} />
                        </span>
                        : null }
                    </div>
                </article>
    )
}