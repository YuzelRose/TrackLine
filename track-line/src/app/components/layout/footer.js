'use client'
import { useRouter } from 'next/navigation'
import PayPalLogoSVG from '../../media/PaypalSVG.js'
import TrackLineSVG from '../../media/Track-lineSVG.js'
import EmailButton from '../from/mailconsult.js'
import styles from './css/footer.module.css'
export default function Footer(){
    const router = useRouter()
    const handleTerminos = () => {
        window.open('/documents/Términos_y_Condiciones _de_Uso_Track_Line_04-11-2025.pdf', '_blank');
    }
    return(
        <footer>
            <section id={styles.space}/> 
            <section id={styles.info}>
                <figure>
                    <TrackLineSVG dim="80%"/>
                    <h5>Siguiendo tu aprendizaje para brindar orientacion</h5>
                </figure>
                <article>
                    <div id={styles.reg}>
                        <p>¿Quiere saber mas de nosotros?</p>
                        <EmailButton children='Contactanos' />
                    </div>
                    <PayPalLogoSVG />
                </article>
            </section>
            <article id={styles.conditions} className='topline'> 
                <h6>Sitio desarrollado por <a  className="link" href="https://github.com/YuzelRose">@YuzelRose</a> y <a  className="link" href="https://github.com/SpacialHarbort">@SpacialHarbort</a></h6>
                <h6><span className='accent'>trackline.edu@gmail.com</span> y <span className='accent'>trackline.service@gmail.com</span>  son los correos oficiales de <strong>©Track-Line</strong></h6>
                <h6><span className="link" onClick={handleTerminos}>Términos de servicio</span></h6>
                <h6>© 2025 Track-Line. Todos los derechos reservados.</h6>
            </article>
        </footer>
    )
}