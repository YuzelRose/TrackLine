'use client'
import TrackLine from '../../media/Track-lineSVG.js'
import styles from './css/header.module.css'
import { useEffect, useState } from 'react'
import { useRouter, usePathname  } from "next/navigation"
import { getSession, NUKE } from '@/app/utils/JsonManage.js'
import UserIconSVG from '@/app/media/DefaultUserSVG.js'
export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [session, setSession] = useState([])
    const [isMain, setIsMain] = useState(true)

    const handleScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            setHeaderVisible(false);
        } else {
            setHeaderVisible(true);
        }
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); 
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    const handleNavigate = () => {
        router.push('/profile')
    }

    useEffect (() =>{
        const session = getSession()
        if(session) setSession(session)
        else NUKE()
    }, [])

    useEffect(() => {
        if(pathname === '/') setIsMain(false)
        else setIsMain(true)
    }, [pathname])

    return (
        <header id={`${headerVisible ? styles.visible : styles.hidden}`}>
            <div 
                id={styles.icon}
                onClick={() => {isMain? router.push('/main') : null}}
            > 
                <TrackLine dim="10em"/>  
            </div>
            <div id={styles.space}/>
            <div id={styles.user}> 
                {session.Email? 
                <figure onClick={handleNavigate} id={styles.profile}>
                    <UserIconSVG clname={styles.userIcon}/>
                    <p>{session.Email}</p>
                </figure>
                : null } 
            </div>
        </header>
    )
}