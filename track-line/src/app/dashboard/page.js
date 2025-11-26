"use client";
import styles from './css/dashboard.module.css';
import { useEffect, useState } from 'react';
import { peticion } from '../utils/Funtions';
import TextForm from '../components/uI/inputs/TextInput';
import { TOKEN } from '../components/uI/inputs/jasonContentemts';
import UserCrud from './user/UserCrud';
import ArrowSVG from '../media/ArrowSVG';
import TabloidCrud from './tabloid/TabloidCrud';

export default function Dashboard(){
  const [tok, setTok] = useState(null)
  const [state, setState] = useState(0)

  useEffect(()=> {
    const security = async () => {
      const tok = await peticion('security/get-tok')
      alert(tok.data.token)
      setTok(tok.data.token)
    }
    security()
  },[])

  const secureSubmit = (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.target)
      const token = formData.get('token')
      if(token === tok) setState(1)
      else alert("Token erroneo")
    } catch (error) {

    }
  }

  if(state === 0) {
    return(
      <main className={styles.dashboard}>
        <form onSubmit={secureSubmit} id={styles.security}>
          <h3>Ingrese el Token:</h3>
          <TextForm content={TOKEN}/>
          <button className='button' type='submit'>
            Confirmar
          </button>
        </form>
      </main>
    )
  }

  if(state===1) {
    return(
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
            onClick={() => setState(3)} 
          >
            Ingresar
          </button>
        </article>
        <article className={`${styles.crudCard} ${styles.tab}`}>
          <h4>Gestión de Tabloides</h4>
          <button 
            className={styles.btn}
            onClick={() => setState(2)}
          >
            Ingresar
          </button>
        </article>
      </section>
    </main>
    )
  }
  if(state===2){
    return(
      <main>
        <div className={styles.buttonWrapper}>
          <button onClick={()=>setState(1)} className='button'>
            <ArrowSVG rot={true}/> Regresar
          </button>
        </div>
        <TabloidCrud/>
      </main>
    )
  }
  if(state===3){
    return(
      <main>
        <div className={styles.buttonWrapper}>
          <button onClick={()=>setState(1)} className='button'>
            <ArrowSVG rot={true}/> Regresar
          </button>
        </div>
        <UserCrud />
      </main>
    )
  }
}
