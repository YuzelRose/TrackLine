"use client";
import styles from './css/tabloid.module.css'
import TabloidCourses from "../components/uI/object/TabloidCourses"
import Calendar from '../components/uI/object/Calendar'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getSession, NUKE } from '../utils/JsonManage';
import { peticion } from '../utils/Funtions';

export default function Main() { 
   const router = useRouter();
   const [data, setData] = useState([])
     
    // solo falta agregar en la parte inferior un buscador de cursos
    useEffect(()=> {
        const getData = async() => {
            try {
                const session = getSession()
                if(session) {
                    const resp = await peticion('user/get-user', {email: session.Email})
                    if(resp.httpStatus === 200) setData(resp.data)
                } else {
                    NUKE()
                    router.push('/')
                }
            } catch (error) {
                alert(`Error inesperado intentelo despues: ${error}`)
                NUKE()
                window.location.href = '/'
            }
        }
        getData()
    }, [])

    return(
        <main id={styles.main}>
            <article id={styles.mainContent}>
                {data.UserType === "student"?
                    <section id={styles.mainSection}>
                        <div className={styles.title}>
                            <h3>Cursos:</h3>
                        </div>
                        <div className={styles.conteiner}>
                            <TabloidCourses />
                        </div>
                    </section>
                : null }
                <aside id={styles.aside}>
                    <div className={styles.title}>
                        <h3>Calendario:</h3>
                    </div>
                    <div className={styles.conteiner}>
                        <Calendar/>
                    </div>
                </aside>
            </article>
            {/* Aqui */}
        </main>
    )
}