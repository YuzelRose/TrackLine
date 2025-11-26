"use client";
import { useRouter } from 'next/navigation';
import styles from './css/dashboard.module.css';

export default function Dashboard(){
  const router = useRouter();
  
  return (
    <main className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Sistema Escolar</h2>
        <h3>Gestiona estudiantes, profesores, tutores y tabloides</h3>
      </div>
      <section className={styles.conteiner}>
        <article className={`${styles.crudCard} ${styles.user}`}>
          <h4>Gestión de usuarios</h4>
          <button 
            className={styles.btn}
            onClick={() => router.push('./dashboard/user')} 
          >
            Ingresar
          </button>
        </article>
        <article className={`${styles.crudCard} ${styles.tab}`}>
          <h4>Gestión de Tabloides</h4>
          <button 
            className={styles.btn}
            onClick={() => router.push('./dashboard/tabloid')}
          >
            Ingresar
          </button>
        </article>
      </section>
    </main>
  );
}