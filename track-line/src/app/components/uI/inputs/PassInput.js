'use client'
import { useState } from "react" 
import styles from './css/inputs.module.css'
import ClosedEye from '@/app/media/ClosedEyeSVG'
import Eye from '@/app/media/EyeSVG'

export default function PassInput({
    name = 'pass', 
    value = null, 
    placeholder = 'Contraseña', 
    onlyPass = false,
    red = false
}) {
    const [show, setShow] = useState(false)

    return(
        <span className='group'>
            { show && !onlyPass ? <>
                <input 
                    type="text" 
                    name={name} 
                    placeholder={placeholder} 
                    className='group-text' 
                    defaultValue={value} 
                    {...(red && { 
                        readOnly: true, 
                        style: { 
                            filter: 'brightness(0.8)',
                            WebkitFilter: 'brightness(0.8)',
                            cursor: 'not-allowed'
                        }
                    })}
                    required 
                />
                <Eye onClick={() => setShow(!show)}/> 
            </> : <>
                <input 
                    type="password" 
                    name={name} 
                    placeholder={placeholder} 
                    className='group-text' 
                    defaultValue={value} 
                    {...(red && {
                        readOnly: true, 
                        style: { 
                            filter: 'brightness(0.8)',
                            WebkitFilter: 'brightness(0.8)',
                            cursor: 'not-allowed'
                        }
                    })}
                    required 
                />
                {!onlyPass ?<ClosedEye onClick={() => setShow(!show)}/> : null}
            </> }
        </span>
    )
}