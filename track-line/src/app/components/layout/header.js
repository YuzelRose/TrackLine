'use client'
import Icon from '../uI/icon.js'
import Profile from '../uI/profile.js'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './css/header.module.css'
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const pathname = usePathname()
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);

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

    useEffect (() =>{
        //setIsLoggedIn= "Completa la peticion despues"
    }, [])

    return (
        <header id={`${headerVisible ? styles.visible : styles.hidden}`}>
            <div id={styles.icon}> <Icon /> </div>
            <div id={styles.space}/>
            <div id={styles.user}> {isLoggedIn ? <Profile /> : <></> } </div>
        </header>
  )
}