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

    useEffect(() => {
            const getData = async () => { 
                try {
                    const session =  getSession()
                    if(!!session) {
                        const urlId = searchParams.get('id')
                        if(!!urlId){
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
                        <p>Nota: {data.Submissions[0].Grade}</p>
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
                        <Submition 
                            data={data.Submissions[0]} 
                            DueDate={data.DueDate} 
                            hwID={data._id}
                        />
                    </div>
                </section>
            </main>
        )
    }
}