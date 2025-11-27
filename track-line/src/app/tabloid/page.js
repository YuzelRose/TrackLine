'use client'
import { useEffect, useState } from "react"
import { peticion } from "../utils/Funtions"
import { useSearchParams } from "next/navigation"
import { useRouter } from 'next/navigation'
import { getSession } from "../utils/JsonManage"
import styles from './css/tabloid.module.css'
import Notice from "../components/uI/object/TabloidContent"
import HgWait from "../components/uI/HgWait"
import NoticeForm from "../components/from/NoticeForm"
import AssigmentForm from "../components/from/AssigmentForm"


export default function Tabloid() {
    const searchParams = useSearchParams() 
    const navigate = useRouter();
    const [data, setData] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rend, setRend] = useState(null)
        
    const getData = async () => {
        try {
            const session =  getSession()
            if(!!session) {
                const urlId = searchParams.get('id')
                if(!!urlId) {
                    const user = await peticion('user/get-user', { email: session.Email })
                    const result = await peticion('tabloid/get-data',{ urlId }) 
                    if(!!result && result.httpStatus === 200) {
                        setData(result.data)
                        setUser(user.data)
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

    const reloadData = () => {
        setLoading(true); // Opcional: mostrar loading durante la recarga
        getData();
    }

    useEffect(() => {
        getData() 
    }, [searchParams, navigate])

    const render = (opc) => {
        switch(opc) {
            case 1: return(<NoticeForm reload={reloadData}/>)
            case 2: return(<AssigmentForm reload={reloadData}/>)
            default: null
        }
    }

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
                    <h3>{data.Name} </h3>
                </div>
                <div id={styles.data}>
                    <h5>NDM: {data._id} {data.Owner? data.Owner : null}</h5>
                    <p>{data.description}</p>
                </div>
                {user.UserType === "profesor" && user._id.toString() === data.Owner.toString() ?
                    <div id={styles.profBtn}> 
                        <div id={styles.add}>
                            <button className="button" onClick={()=>setRend(1)}>
                                Nuevo aviso
                            </button>
                            <button className="button" onClick={()=>setRend(2)}>
                                Nueva Tarea
                            </button>
                        </div>
                        {render(rend)}
                        {!!rend?
                            <button className="button" onClick={()=>setRend(null)}>
                                Cerrar ventana
                            </button>
                        : null}
                    </div>
                : null}

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