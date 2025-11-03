'use client'
import { useRouter } from 'next/navigation'
import PayPalLogoSVG from '../../media/paypalSVG.js'
import TrackLineSVG from '../../media/track-lineSVG.js'
import EmailButton from '../from/mailconsult.js'
import styles from './css/footer.module.css'
export default function Footer(){
    const router = useRouter()
    const handleNavigate = () => {
        router.push('/profile/blank')
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
                <h6 onClick={handleNavigate}><span className="link" onClick={handleNavigate}>Términos de servicio</span></h6>
                <h6>Track Line ©2025</h6>
            </article>
        </footer>
    )
}