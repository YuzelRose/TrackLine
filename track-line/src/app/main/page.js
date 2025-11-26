"use client";
import styles from './css/tabloid.module.css'
import TabloidCourses from "../components/uI/object/TabloidCourses"
import Calendar from '../components/uI/object/Calendar'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getSession, NUKE } from '../utils/JsonManage';
import { peticion } from '../utils/Funtions';
import AllTabloids from '../components/uI/object/AllTabloids';

export default function Main() { 
   const router = useRouter();
   const [data, setData] = useState([])
   const [type, setType] = useState("")
     
    useEffect(()=> {
        const getData = async() => {
            try {
                const session = getSession()
                if(session) {
                    const resp = await peticion('user/get-user', {email: session.Email})
                    if(resp.httpStatus === 200) {
                        setData(resp.data)
                        setType(resp.data.UserType)
                    }
                } else {
                    NUKE()
                    router.push('/')
                }
            } catch (error) {
                alert(`Error inesperado intentelo despues: ${error}`)
                NUKE()
                window.location.reload()
                window.location.href = '/'
            }
        }
        getData()
    }, [])

    const render = () => {
        switch(type){
            case "tutor":
                return(
                    <section className={styles.welcomeSection}>
                        <div className={styles.welcomeCard}>
                            <h3>¡Bienvenido Tutor!</h3>
                            <p>En Track-Line estamos para servirlo, puede contactarnos mediante el boton al final de la pagina.</p>
                        </div>
                    </section>
                )
            default:
                return(
                    <section id={styles.mainSection}>
                        <div className={styles.title}>
                            <h3>Cursos:</h3>
                        </div>
                        <div className={styles.conteiner}>
                            <TabloidCourses />
                        </div>
                    </section>
                )
        }
    }

    return(
        <main id={styles.main}>
            <article id={styles.mainContent}>
                {render()}
                <aside id={styles.aside}>
                    <div className={styles.title}>
                        <h3>Calendario:</h3>
                    </div>
                    <div className={styles.conteiner}>
                        <Calendar/>
                    </div>
                </aside>
            </article>
            {data.UserType === "tutor" || data.RelatedEmail === null?
                <AllTabloids/>
            : null}
        </main>
    )
}