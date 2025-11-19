'use client'
import styles from './css/object.module.css'
import HgWait from '../HgWait';
import DotsSVG from '@/app/media/DotsSVG';
import { peticion } from '@/app/utils/Funtions';
import { getSession } from '@/app/utils/JsonManage';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

export default function TabloidCourses() {
    const navigate = useRouter();
    const [courses, setCourses] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = getSession()
                if(!data) {
                    navigate.push('/');
                    return;
                }
                const coursesData = await peticion('tabloid/get-courses', { email: data.Email })
                setCourses(coursesData.data.validCourses)
            } catch (error) {
                console.error('Error recuperando cursos:', error)
                setCourses([])
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [navigate])

    // Estado de carga
    if (loading) {
        return (
            <section id={styles.hgConteiner}>
                <div id={styles.hg}>
                    <HgWait/>
                </div>
            </section>
        )
    }

    // Si no hay cursos
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return (
            <div>
                <p id={styles.conteiner}>No se ha registrado a ningún curso.</p> 
            </div>
        )
    }

    return(
        <div id={styles.gridConteiner}>
            {courses.map(course => (
                <article key={course.refId._id} className={styles.item} 
                onClick={() => navigate.push(`/tabloid?id=${course.refId._id}`)}>
                    <div>
                        <h6 className={styles.itemHeader}>
                            {course.refId.Name || 'Sin nombre'} 
                            <span 
                                className={styles.dotConteiner} 
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DotsSVG url={course.refId._id}/>
                            </span>
                        </h6>
                        <p className={styles.description}>{course.refId.description}</p>
                    </div>
                    {course.refId.HomeWork ?
                        <ul className={styles.hwUl}>

                            {course.refId.HomeWork.map(hw => (
                                <li 
                                    key={hw._id} 
                                    className={styles.hwLi}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <p
                                        onClick={() => navigate.push(`/tabloid/assigment?id=${course.refId._id}&hw-id=${hw._id}`)}
                                    >
                                        {hw.Name}: {hw.Date}
                                    </p>
                                </li>
                            ))} 
                        </ul>
                    : null}
                </article>
            ))}
        </div>
    )
}