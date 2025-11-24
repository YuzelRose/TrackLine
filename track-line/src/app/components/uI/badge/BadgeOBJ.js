'use client'
import { useState } from "react"
import HgWait from "../HgWait"
import styles from './css/badge.module.css'
import DropSVG from "@/app/media/DropSVG"
import { getMatchingBadges } from "./badgesData"

export default function BadgeOBJ({session}) {
    const [loading, setLoading] = useState(true)
    const [drop, setDrop] = useState(false)
    const [data, setData] = useState([])

    const getData = async() => {
        try {
            setLoading(true)
            if (!drop) {
                const badges = getMatchingBadges(session)
                if(badges) setData(badges)
            }
            setDrop(!drop)
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    } 
    
    const content = () => {
        if(loading) {
            return <HgWait/>
        } else if (data.length === 0) {
            return <p>No tienes insignias aún</p>
        } else {
            return(
                <div className={styles.badgesGrid}>
                    {data.map(badg => (
                        <figure key={badg.id} title={badg.criteria} className={styles.badge}>
                            <div className={styles.badgeIcon}>{badg.image}</div>
                            <figcaption className={styles.badgeName}>{badg.name}</figcaption>
                        </figure>
                    ))}
                    <figure title="Sigue trabajando duro para conseguir mas" className={styles.badge}>
                        <div className={styles.badgeIcon}>?</div>
                        <figcaption className={styles.badgeName}>¿Más?</figcaption>
                    </figure>
                </div>
            )
        }
    }

    return(
        <section id={styles.BadgeOBJ}>
            <p className={styles.p}>
                {drop ? "Insignias obtenidas:" : "Pulse para ver sus insignias:"}
            </p>
            
            {drop && content()}
            
            <div id={styles.dropBadges}>
                <div 
                    className={styles.drop}
                    title={drop ? "Ocultar insignias" : "Mostrar insignias"}
                    onClick={getData}
                    style={{transform: drop ? "rotate(180deg)" : "rotate(0deg)"}}
                >
                    <DropSVG/>
                </div>
            </div>
        </section>
    )
}