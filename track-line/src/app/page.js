'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Login from "./components/from/Login.js"
import Register from "./components/from/Register"
import Image from "next/image"
import backgroundImage from '@/app/media/pexels-august-de-richelieu-4260475.jpg'
import ArrowSVG from "./media/ArrowSVG.js"
import styles from './page.module.css'
import { GetKeep, miniNUKE, NUKE } from "./utils/JsonManage.js"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router  = useRouter();
  const [login,setLogin] = useState(true)
  const [wait, setWait] = useState(false)

  useEffect(() => {
      miniNUKE()
      if (GetKeep()) {
        router.push('/tabloid');
      } else {
        NUKE()
      }
  }, [router]);

  const setWaitingStatus = (waiting) => {
    setWait(waiting)
  }

  return (
    <main>
       <section id={styles.parent}>
        <div id={styles.log}> 
          <section id={styles.conteiner}>
            <h3 
              onClick={() => setLogin(!login)} 
              id={styles.h3}
              style={{ 
                cursor: wait ? 'not-allowed' : 'pointer',
                opacity: wait ? 0.6 : 1 
              }} 
            >
              {login ? (
                <>
                  Iniciar sesión 
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 1 }}
                    style={{ display: 'inline-block', marginLeft: '8px' }}
                  >
                    <ArrowSVG />
                  </motion.div>
                </>
              ) : (
                <>
                  Registrarse
                  <motion.div
                    initial={{ scaleX: -1 }}
                    animate={{ scaleX: -1 }}
                    style={{ display: 'inline-block', marginLeft: '8px' }}
                  >
                    <ArrowSVG />
                  </motion.div>
                </>
              )}
            </h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={login ? "login" : "register"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {login ? 
                  <Login onWaitingChange={setWaitingStatus}/> 
                : 
                  <Register onWaitingChange={setWaitingStatus}/>
                }
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
        <div className={styles.text} id={styles.txt1}> 
          <h5>Nuestra Misión</h5>
          <p>
            Somos Track Line, una plataforma educativa que impulsa el aprendizaje digital y facilita la comunicación entre estudiantes, maestros y padres de familia. Promovemos que los padres estén siempre informados sobre los métodos de enseñanza y el desempeño académico de sus hijos, creando un puente sólido entre el hogar y la institución educativa.
          </p>
        </div>
        <figure id={styles.img}>
          <Image
            src={backgroundImage}
            alt="A tu lado siempre"
            id={styles.image}
          />
        </figure>
        <div className={styles.text} id={styles.txt2}>
          <h5>Nuestro Compromiso</h5>
          <p>
            Nuestro objetivo es fortalecer la participación de toda la comunidad escolar mediante herramientas innovadoras que faciliten el acceso a la información, la organización de actividades y el acompañamiento constante en el proceso educativo.
          </p>
          <h5>
            Creemos en la educación como motor fundamental del desarrollo personal y académico, por lo que hemos creado un espacio seguro, moderno e inclusivo donde cada estudiante puede aprender de manera efectiva y cada familia puede involucrarse activamente en el crecimiento de sus hijos.
          </h5>
        </div>
      </section>
    </main>
  );
}