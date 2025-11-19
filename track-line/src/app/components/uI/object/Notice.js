'use client'
import { useRouter } from 'next/navigation'

export default function Notice(data = []) {
    const navigate = useRouter();    
    return(
        <>
            {data ? 
                data.map(notice => (
                    <article key={notice._id}>
                        {/* contenido del article */}
                    </article>
                ))
            : 
                <>
                    <p>Sin novedades, te avisaremos cuando el camino empiece.</p>
                    <p 
                        className='link'
                        onClick={() => navigate.push('/main')}
                    >
                        Regresar a la pagina principal.
                    </p>
                </>
            }
        </>
    )
}