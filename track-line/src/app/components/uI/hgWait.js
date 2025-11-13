import HourglassSVG from "@/app/media/HourGlassSVG";
import { useEffect, useState } from "react";
import styles from './css/ui.module.css'

export default function HgWait(){
    const [wait, setWait] = useState('Cargando')
    const [dotCount, setDotCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount(prev => {
                const nextCount = (prev + 1) % 4 
                setWait('Cargando' + '.'.repeat(nextCount))
                return nextCount
            })
        }, 600) 
        return () => clearInterval(interval)
    }, [])

    return(
        <div id={styles.hg}>
            <p>{wait}</p>
            <HourglassSVG/>
        </div>
    )
}
