'use client'
import { useEffect, useState } from "react"
import { peticion } from "../utils/Funtions"
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation'
import { getSession } from "../utils/JsonManage"
import styles from './css/tabloid.module.css'
import Notice from "../components/uI/object/TabloidContent"
import HgWait from "../components/uI/HgWait"
import DotsSVG from "../media/DotsSVG"


export default function Tabloid() {
    const searchParams = useSearchParams() 
    const navigate = useRouter();
    const [session, setSession] = useState(false)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
        
    useEffect(() => {
        const getData = async () => {
            try {
                const session =  getSession()
                if(!!session) {
                    const urlId = searchParams.get('id')
                    if(!!urlId){
                        const result = await peticion('tabloid/get-data',{ urlId })
                        if(!!result && result.httpStatus === 200) {
                            setSession(session)
                            setData(result.data)
                            
                        }
                    } else navigate.push('/main');
                } else navigate.push('/')
            } catch (error) {
                console.error('Error recuperando informacion:', error)
                setCourses([])
            } finally {
                setLoading(false)
            }
        }
        getData() 
    }, [searchParams, navigate])

    if(loading) {
        return(
            <main id={styles.main}>
                <div id={styles.hg}>
                    <HgWait/>
                </div>
            </main>
        )
    } else {
        return(
            <main id={styles.main}>
                <div id={styles.header}>
                    <h3>{data.Name}  <DotsSVG url={data._id} height="0.75em"/></h3>
                </div>
                <div id={styles.data}>
                    <h5>NDM: {data._id} {data.Owner? data.Owner : null}</h5>
                    <p>{data.description}</p>
                </div>
                {data?
                    <section id={styles.conteiner}>
                        {data.HomeWork.map(notice => (
                            <Notice 
                                key={notice._id} 
                                data={notice.notice || notice.assigment}
                                type={notice.notice? 'Aviso' : 'Tarea'}
                            />
                        ))}
                    </section>
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
            </main>
        )
    }
}