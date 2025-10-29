'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react";
import Login from "./components/from/login";
import Register from "./components/from/register";
import Image from "next/image";
import backgroundImage from '@/app/media/pexels-august-de-richelieu-4260475.jpg'
import ArrowSVG from "./media/arrowSVG";
import styles from './page.module.css'
export default function Home() {
  const [login,setLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [wait, setWait] = useState(false)

  const handleToggle = () => {
    if (!wait && !isAnimating) {
      setLogin(!login)
    }
  }

  const setWaitingStatus = (waiting) => {
    setWait(waiting)
  }

  return (
    <main>
       <section id={styles.parent}>
        <div id={styles.log}> 
          <section id={styles.conteiner}>
            <h3 
              onClick={handleToggle} 
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
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
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
          <h3>Nuestra Misión</h3>
          <h5>
            Somos Track Line, una plataforma educativa que impulsa el aprendizaje digital y facilita la comunicación entre estudiantes, maestros y padres de familia. Promovemos que los padres estén siempre informados sobre los métodos de enseñanza y el desempeño académico de sus hijos, creando un puente sólido entre el hogar y la institución educativa.
          </h5>
        </div>
        <figure id={styles.img}>
          <Image
            src={backgroundImage}
            alt="A tu lado siempre"
            id={styles.image}
          />
        </figure>
        <div className={styles.text} id={styles.txt2}>
          <h3>Nuestro Compromiso</h3>
          <h5>
            Nuestro objetivo es fortalecer la participación de toda la comunidad escolar mediante herramientas innovadoras que faciliten el acceso a la información, la organización de actividades y el acompañamiento constante en el proceso educativo.
          </h5>
          <h5>
            Creemos en la educación como motor fundamental del desarrollo personal y académico, por lo que hemos creado un espacio seguro, moderno e inclusivo donde cada estudiante puede aprender de manera efectiva y cada familia puede involucrarse activamente en el crecimiento de sus hijos.
          </h5>
        </div>
      </section>
    </main>
  );
}