'use client'
import Profile from '../uI/Profile.js'
import TrackLine from '../../media/Track-lineSVG.js'
import { useEffect, useState } from 'react'
import styles from './css/header.module.css'
export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
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
            <div id={styles.icon}> <TrackLine dim="10em" style="pointer" /> </div>
            <div id={styles.space}/>
            <div id={styles.user}> {isLoggedIn ? <Profile /> : <></> } </div>
        </header>
  )
}