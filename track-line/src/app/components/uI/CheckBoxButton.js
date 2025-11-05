'use client'

import BoxChekedSVG from "@/app/media/boxChekedSVG"
import BoxSVG from "@/app/media/boxSVG"
import { useState } from "react"
import styles from './css/ui.module.css'

export default function CheckBoxButton({ 
    text, 
    onclick = () => {}, 
    state = false, 
    onlychange = false 
}){
    const [check, setCheck] = useState(state)

    const handleClick = () => {
        // Primero ejecuta la lógica interna del checkbox
        setCheck(!state)
        if(!onlychange) {
            setCheck(!check)
            state = !state
        }
        
        // Luego ejecuta la función onclick que se pasa por props
        if (onclick) {
            onclick(); // Ejecuta la función adicional
        }
    }

    return(
        <div id={styles.keep} onClick={handleClick}>
            { check ? 
                <BoxChekedSVG /> 
            : 
                <BoxSVG /> 
            } 
            {text}
        </div>
    )
}