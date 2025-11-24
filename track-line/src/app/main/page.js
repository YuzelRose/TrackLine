"use client";
import styles from './css/tabloid.module.css'
import TabloidCourses from "../components/uI/object/TabloidCourses"
import Calendar from '../components/uI/object/Calendar'
import { useRouter } from 'next/navigation'



export default function Main() { 
   const router = useRouter();
     
    // solo falta agregar en la parte inferior un buscador de cursos
    return(
        <main id={styles.main}>
             <button 
                className={styles.dashboardBtn}
                onClick={() => router.push('/dashboard')} 
            >
                Ir al Dashboard
            </button>
            <article id={styles.mainContent}>
                <section id={styles.mainSection}>
                    <div className={styles.title}>
                        <h3>Cursos:</h3>
                    </div>
                    <div className={styles.conteiner}>
                        <TabloidCourses />
                    </div>
                </section>
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