'use client'

import { useEffect, useState } from "react"
import HgWait from "../components/uI/HgWait"
import styles from './css/profile.module.css'
import { getSession, NUKE } from "../utils/JsonManage"
import { peticion } from "../utils/Funtions"
import { useRouter } from "next/navigation"
import BadgeOBJ from "../components/uI/badge/BadgeOBJ"

export default function Profile(){
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [showID, setShowID] = useState(false)
    const [session, setSession] = useState([])

    useEffect(() => {
        const getProfile = async () => {
            try {
                const session = getSession()
                if(!!session) {
                    const result = await peticion('user/get-user', {email: session.Email})
                    if(result.httpStatus === 200) {
                        setData(result.data)
                        setSession(session)
                    }
                    else router.push('/main')
                } else {
                    NUKE()
                    router.push('/')
                }
            } catch (error) {
                alert('Error inesperado intentelo despues')
                router.push('/main')
            } finally {
                setLoading(false)
            }
        }
        getProfile()
    },[])

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setShowID(!showID)
            return true;
        } catch (err) {
            return copyToClipboardFallback(text);
        }
    }


    if(loading){
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
                <section id={styles.userProfile}>
                    <div id={styles.profileMark}>
                        a
                    </div>
                    <div id={styles.profileInfo}>
                        <div className={styles.row}>
                            <h4>{data.Name}</h4>
                            <h6 
                                onClick={()=>setShowID(!showID)}
                                id={styles.id}
                                title={showID? "Ocultar ID" : "Mostrar ID"}
                            >
                                ID
                            </h6>
                        </div>
                        {showID? 
                            <p 
                                className={styles.ID}
                                onClick={()=>copyToClipboard(data._id)}
                                title={"Copiar y ocultar"} 
                            >
                                ID: {data._id}
                            </p> 
                        : null }
                        <p>
                            Fecha de nacimiento: {(() => {
                                const [year, month, day] = data.Birth.split('-')
                                return `${day}/${month}/${year}`
                            })()}
                        </p>
                        <p>CURP: {data.CURP}</p>
                    </div>
                </section>
                <BadgeOBJ session={data.Badges}/>
            </main>
        )
    }
}