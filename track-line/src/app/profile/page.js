'use client'

import HgWait from "../components/uI/HgWait"
import styles from './css/profile.module.css'
import BadgeOBJ from "../components/uI/badge/BadgeOBJ"
import AccountOPC from "../components/from/AccountOPC"
import TrackLineSVG from "../media/Track-lineSVG"
import { peticion } from "../utils/Funtions"
import { getSession } from "../utils/JsonManage"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Profile() { 
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [showID, setShowID] = useState(false)
    const [showCURP, setShowCURP] = useState(false)

    useEffect(() => {
        const getProfile = async () => {
            try {
                const sessionData = getSession()
                if(!sessionData) {
                    window.location.href = '/' 
                    return
                }
                const result = await peticion('user/get-user', {email: sessionData.Email})
                if(result.httpStatus === 200) setData(result.data)
                else window.location.href = '/main' 
            } catch (error) {
                alert(`Error inesperado intentelo despues: ${error}`)
                window.location.href = '/' 
            } finally {
                setLoading(false)
            }
        }
        getProfile()
    }, [])

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
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
                <div id={styles.content}>
                    <section id={styles.userProfile}>
                        <div id={styles.profileMark}>
                            <TrackLineSVG dim={"6em"}/>
                        </div>
                        <div id={styles.profileInfo}>
                            <div className={styles.row}>
                                <h5 className={styles.text}>{data.Name}</h5>
                            </div>
                            {showID? 
                                <p 
                                    className={styles.ID}
                                    onClick={() => {
                                        setShowID(!showID)
                                        copyToClipboard(data._id)
                                    }}
                                    title={"Copiar y ocultar"} 
                                >
                                    ID: {data._id}
                                </p> 
                            :
                                <h6 
                                    onClick={() => setShowID(!showID)}
                                    id={styles.id}
                                    title={showID? "Ocultar ID" : "Mostrar ID"}
                                >
                                    ID
                                </h6> 
                            }
                            <p>
                                Fecha de nacimiento: {(() => {
                                    const [year, month, day] = data.Birth.split('-')
                                    return `${day}/${month}/${year}`
                                })()}
                            </p>
                            {showCURP? 
                                <p 
                                    className={styles.ID}
                                    onClick={() => {
                                        setShowCURP(!showCURP)
                                        copyToClipboard(data.CURP,)
                                    }}
                                    title={"Copiar y ocultar"} 
                                >
                                    {data.CURP}
                                </p> 
                            :
                                <h6 
                                    onClick={() => setShowCURP(!showCURP)}
                                    id={styles.id}
                                    title={showCURP? "Ocultar CURP" : "Mostrar CURP"}
                                >
                                    CURP
                                </h6> 
                            }
                        </div>
                    </section>
                    {data.UserType === "student"?    
                        <BadgeOBJ session={data.Badges}/>
                    : null }
                    {(data.UserType === "student" || data.UserType === "tutor") && (
                        <section className={styles.content}>
                            {(data.UserType === "student" && data.RelatedEmail === null) || data.UserType === "tutor" ? (
                                <p
                                    onClick={() => router.push(`/profile/payment?id=${data.UserType === "student" ? data.Email : data.RelatedEmail}`)}
                                >
                                    Consultar adeudos
                                </p>
                            ) : null}
                            <p
                                onClick={() => router.push(`/profile/kardex?id=${data.UserType === "student" ? data.Email : data.RelatedEmail}`)}
                            >
                                Consultar Kardex
                            </p>
                        </section>
                    )}
                    {!data.RelatedEmail || data.UserType !== "student" ? 
                        <AccountOPC data={data}/>
                    : null }
                </div>
            </main>
        )
    }
}