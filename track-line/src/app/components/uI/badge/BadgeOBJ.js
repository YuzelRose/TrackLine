'use client'
import { useState } from "react"
import HgWait from "../HgWait"
import styles from './css/badge.module.css'
import DropSVG from "@/app/media/DropSVG"

export default function BadgeOBJ({session}) {
    const [loading, setLoading] = useState(true)
    const [drop, setDrop] = useState(false)
    const [data, setData] = useState([])
    
    const content = () => {
        if(loading) {
            return(
                <div>
                    <HgWait />
                </div>
            )
        } else {
            return(
                <div>
                    {data.map(badg => {
                        <figure key={badg.id} title={badg.criteria}>
                            {badg.image}
                        </figure>
                    })}
                </div>
            )
        }
    }

    return(
        <section id={styles.BadgeOBJ}>
            <p className={styles.p}>
                {drop? "Pulse para ver sus insignias:": "Insignias obtenidas:"}
            </p>
            {drop? null : content() }
            <div id={styles.dropBadges}>
                <div 
                    className={styles.drop}
                    title="Mostrar Insignias"
                    onClick={() => setDrop(!drop)}
                    style={{transform: ""}}
                >
                    <DropSVG/>
                </div>
            </div>
        </section>
    )
}