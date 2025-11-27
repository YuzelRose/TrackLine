'use client'
import HgWait from '@/app/components/uI/HgWait';
import styles from './css/hw.module.css'
import { peticion } from "@/app/utils/Funtions";
import { getSession } from "@/app/utils/JsonManage"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"
import Submition from '@/app/components/from/Submition';
import FileOBJ from '@/app/components/uI/object/FileOBJ';

export default function HomeWorkPage() {
    const searchParams = useSearchParams() 
    const navigate = useRouter()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getData = async () => { 
            try {
                const session = getSession()
                if(!session) {
                    navigate.push('/')
                    return
                }

                const urlId = searchParams.get('id')
                if(!urlId) {
                    navigate.push('/main')
                    return
                }

                const result = await peticion('tabloid/get-hw', { 
                    data: {
                        urlId: urlId,
                        email: session.Email
                    } 
                })

                if(result && result.httpStatus === 200) {
                    setData(result.data)
                } else {
                    setError(result?.message || 'No se pudo cargar la información de la tarea')
                }
            } catch (error) {
                console.error('Error recuperando información:', error)
                setError('Error al cargar los datos de la tarea')
            } finally {
                setLoading(false)
            }
        }

        const getUser = async() => {
            try {
                const session = getSession()
                if(session) {
                    const resp = await peticion('user/get-user', {email: session.Email})
                    if(resp.httpStatus === 200) {
                        setUser(resp.data)
                    } else {
                        setError(resp?.message || 'Error al obtener información del usuario')
                    }
                } else {
                    // NUKE() - Comentado ya que no está definido en el código
                    navigate.push('/')
                }
            } catch (error) {
                console.error('Error obteniendo usuario:', error)
                setError('Error al cargar información del usuario')
            }
        }

        getUser()
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
    }

    if (error) {
        return (
            <main id={styles.main}>
                <div className={styles.error}>{error}</div>
            </main>
        )
    }

    if (!data) {
        return (
            <main id={styles.main}>
                <div>No se pudo cargar la información de la tarea</div>
            </main>
        )
    }

    // Validar que user esté cargado antes de renderizar
    if (!user) {
        return (
            <main id={styles.main}>
                <div>Cargando información del usuario...</div>
            </main>
        )
    }

    return(
        <main id={styles.main}>
            <section id={styles.header}>
                <div>
                    <h4>{data.Name || 'Tarea sin nombre'}</h4>
                    <p className={styles.muted}>
                        {data.Owner || 'Sin autor'} • {data.CreatedAt ? 
                            new Date(data.CreatedAt).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'Fecha no disponible'
                        }
                    </p>
                </div>
                <div>
                    <p>Nota: {data.Submissions?.[0]?.Grade !== undefined 
                        ? data.Submissions[0].Grade 
                        : 'Sin calificar'}
                    </p>
                </div>
            </section>
            <section id={styles.content}>
                <div>
                    <p>{data.Text || 'Sin descripción'}</p>
                    {data.Content && (
                        <>
                            <p id={styles.pMat}>Materiales:</p>
                            <FileOBJ data={data.Content} type={2}/>
                        </>
                    )}
                </div>
                <div id={styles.submitionWrapper}>
                    {user.UserType === "student" && (
                        <Submition 
                            data={data.Submissions?.find(sub => sub.Student === user._id) || null} 
                            DueDate={data.DueDate} 
                            hwID={data._id}
                            studentId={user._id}
                        /> 
                    )}
                </div>
            </section>
        </main>
    )
}