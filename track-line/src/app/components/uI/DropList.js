'use client'
import { useState } from "react"
import styles from './css/ui.module.css'

export default function DropList({ info, text, onclick }) {
    const [change, setChange] = useState(false)
    const [selectedText, setSelectedText] = useState(text)
    const handleItemClick  = ({itemText,type}) => {
        setSelectedText(itemText)
        setChange(false)
        if (onclick) {
            const selection = {
                text: itemText, 
                type: type
            }
            onclick(selection);
        } 
    }
    return(
        <div className={styles.dropList}>
            <div 
                className={styles.dropHeader} 
                onClick={() => setChange(!change)}
            >
                {selectedText}
            </div>
            
            {change && (
                <div className={styles.dropContent}>
                    {info.map(item => (
                        <p 
                            key={item.id} 
                            onClick={() => handleItemClick({
                                itemText: item.text, 
                                type: item.type
                            })}
                            className={styles.dropItem}
                        >
                            {item.text}
                        </p>
                    ))}
                </div>
            )}
        </div> 
    )
}