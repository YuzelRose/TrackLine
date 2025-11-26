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

    useEffect(() => {
        const getData = async () => { 
            try {
                const session = getSession()
                if(!!session) {
                    const urlId = searchParams.get('id')
                    if(!!urlId) {
                        const result = await peticion('tabloid/get-hw',{ 
                            data: {
                                urlId: urlId,
                                email: session.Email
                            } 
                        })
                        if(!!result && result.httpStatus === 200) {
                            setData(result.data)
                        }
                    } else navigate.push('/main');
                } else navigate.push('/')
            } catch (error) {
                console.error('Error recuperando informacion:', error)
                setData(null) // Cambié setCourses([]) por setData(null)
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
                    }
                } else {
                    NUKE()
                    router.push('/')
                }
            } catch (error) {
                alert(`Error inesperado intentelo despues: ${error}`)
                NUKE()
                window.location.reload()
                window.location.href = '/'
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

    // Verificar si data existe y tiene la estructura esperada
    if (!data) {
        return (
            <main id={styles.main}>
                <div>No se pudo cargar la información de la tarea</div>
            </main>
        )
    }

    return(
        <main id={styles.main}>
            <section id={styles.header}>
                <div>
                    <h4>{data.Name}</h4>
                    <p className={styles.muted}>{data.Owner} • {new Date(data.CreatedAt).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                </div>
                <div>
                    {/* Verificación segura para Submissions */}
                    <p>Nota: {data.Submissions && data.Submissions[0] && data.Submissions[0].Grade !== undefined 
                        ? data.Submissions[0].Grade 
                        : 'Sin calificar'}
                    </p>
                </div>
            </section>
            <section id={styles.content}>
                <div>
                    <p>{data.Text}</p>
                    {data.Content?
                        <>
                            <p id={styles.pMat}>Materiales:</p>
                            <FileOBJ data={data.Content} type={2}/>
                        </>
                    : null }
                </div>
                <div id={styles.submitionWrapper}>
                    {/* Verificación segura para pasar submissions a Submition */}
                    <Submition 
                        data={data.Submissions && data.Submissions[0] ? data.Submissions[0] : null} 
                        DueDate={data.DueDate} 
                        hwID={data._id}
                        studentId={user._id}
                    />
                </div>
            </section>
        </main>
    )
}