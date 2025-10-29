'use client'
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from 'react'
import TrackLine from '../../media/track-lineSVG.js'

export default function Icon({ icon }){
    const [isOnLanding, setIsOnLanding] = useState(true)    
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() =>{
        if(pathname!=='/') setIsOnLanding(false) 
    }, [])

    const handleNavigate = () => {
        if(pathname !== '/' && pathname !== '/main-page') 
            router.push('/main-page')
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