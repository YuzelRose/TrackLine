'use client'
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import TrackLine from '../../media/Track-lineSVG.js'
// No se esta usando este componente actualmente 
export default function Icon({ icon }) {
    const [isOnLanding, setIsOnLanding] = useState(true)    
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() =>{
        if(pathname!=='/') setIsOnLanding(false) 
    }, [])

    const handleNavigate = () => {
        if(pathname !== '/') 
            router.push('/')
    }
    
    return(
        <>
            { isOnLanding ?  
                <TrackLine dim="10em" style="pointer" /> 
            : 
                <img src={icon} alt="Pagina principal" onClick={handleNavigate} style={{cursor: 'pointer'}}/> 
            }
        </>
    )
}