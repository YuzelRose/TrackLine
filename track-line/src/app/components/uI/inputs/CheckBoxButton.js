'use client'
import BoxChekedSVG from "@/app/media/BoxChekedSVG"
import BoxSVG from "@/app/media/BoxSVG"
import { useState } from "react"
import styles from './css/inputs.module.css'

export default function CheckBoxButton({ 
    text = "Te falta la etiqueta text.", 
    onclick = () => {}, 
    state = false, 
    onlyChange = false,
    notChange = false
}){
    const [check, setCheck] = useState(state)

    const handleClick = () => {
        if(!notChange) {
            setCheck(!state)
            if(!onlyChange) {
                setCheck(!check)
                state = !state
            }
            if (onclick) onclick(); 
        }
    }

    return(
        <div id={styles.keep} className={notChange ? styles.brightless : styles.bright} onClick={handleClick} >
            { check ? 
                <BoxChekedSVG /> 
            : 
                <BoxSVG /> 
            } 
            {text}
        </div>
    )
}