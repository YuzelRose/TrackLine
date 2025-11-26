'use client'
import { useEffect, useState } from 'react'
import { peticion } from '@/app/utils/Funtions'
import { getSession } from '@/app/utils/JsonManage'

export default function Kardex() {
    const [userData, setUserData] = useState(null)
    const [tabloids, setTabloids] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const session = getSession()
                if (session) {
                    const resp = await peticion('user/get-user', { email: session.Email })
                    if (resp.httpStatus === 200) {
                        setUserData(resp.data)
                        // Obtener información de los tabloides
                        await fetchTabloidsData(resp.data.Tabloids)
                    }
                }
            } catch (error) {
                console.error('Error obteniendo datos:', error)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    const fetchTabloidsData = async (tabloidsList) => {
        try {
            const tabloidPromises = tabloidsList.map(async (tabloid) => {
                const resp = await peticion('tabloid/get-tabloid', { id: tabloid.refId })
                return resp.data
            })
            const tabloidsData = await Promise.all(tabloidPromises)
            setTabloids(tabloidsData)
        } catch (error) {
            console.error('Error obteniendo tabloides:', error)
        }
    }

    const calculateAverage = (submissions) => {
        if (!submissions || submissions.length === 0) return 0
        const gradedSubmissions = submissions.filter(sub => sub.Grade && sub.Grade > 0)
        if (gradedSubmissions.length === 0) return 0
        const total = gradedSubmissions.reduce((sum, sub) => sum + sub.Grade, 0)
        return (total / gradedSubmissions.length).toFixed(2)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Entregado': return 'var(--green-500)'
            case 'Tarde': return 'var(--green-300)'
            case 'Pendiente': return 'var(--blue-400)'
            default: return 'var(--muted-foreground)'
        }
    }

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'var(--green-600)'
        if (grade >= 80) return 'var(--green-500)'
        if (grade >= 70) return 'var(--green-400)'
        if (grade >= 60) return 'var(--green-300)'
        return 'var(--green-200)'
    }

    if (loading) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                color: 'var(--muted-foreground)'
            }}>
                Cargando kárdex...
            </div>
        )
    }

    if (!userData) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                color: 'var(--muted-foreground)'
            }}>
                No se pudo cargar la información del kárdex
            </div>
        )
    }

    return (
        <div style={{ 
            padding: '2rem',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            minHeight: '100vh'
        }}>
            {/* Header del Kárdex */}
            <div style={{ 
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: 'var(--card)',
                borderRadius: '1rem',
                border: '2px solid var(--border)'
            }}>
                <h1 style={{ 
                    color: 'var(--primary)',
                    marginBottom: '0.5rem'
                }}>
                    Kárdex Académico
                </h1>
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem'
                }}>
                    <div>
                        <strong style={{ color: 'var(--muted-foreground)' }}>Estudiante:</strong>
                        <p>{userData.Name}</p>
                    </div>
                    <div>
                        <strong style={{ color: 'var(--muted-foreground)' }}>Kárdex:</strong>
                        <p>{userData.kardex}</p>
                    </div>
                    <div>
                        <strong style={{ color: 'var(--muted-foreground)' }}>Email:</strong>
                        <p>{userData.Email}</p>
                    </div>
                </div>
            </div>

            {/* Badges */}
            {userData.Badges && userData.Badges.length > 0 && (
                <div style={{ 
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '1rem',
                    border: '2px solid var(--border)'
                }}>
                    <h2 style={{ 
                        color: 'var(--primary)',
                        marginBottom: '1rem'
                    }}>
                        Insignias Obtenidas
                    </h2>
                    <div style={{ 
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        {userData.Badges.map((badge, index) => (
                            <div key={index} style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--secondary)',
                                color: 'var(--secondary-foreground)',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--accent)'
                            }}>
                                {badge.refId}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabloides y Calificaciones */}
            <div style={{ 
                marginBottom: '2rem'
            }}>
                <h2 style={{ 
                    color: 'var(--primary)',
                    marginBottom: '1rem',
                    padding: '0 1rem'
                }}>
                    Materias Inscritas
                </h2>
                
                {tabloids.map((tabloid, index) => (
                    <div key={index} style={{
                        marginBottom: '1rem',
                        padding: '1.5rem',
                        backgroundColor: 'var(--card)',
                        borderRadius: '1rem',
                        border: '2px solid var(--border)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)' }}>
                                    {tabloid.Name}
                                </h3>
                                <p style={{ 
                                    color: 'var(--muted-foreground)',
                                    marginTop: '0.5rem'
                                }}>
                                    {tabloid.description}
                                </p>
                            </div>
                            <div style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--primary)',
                                color: 'var(--primary-foreground)',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold'
                            }}>
                                Promedio: {calculateAverage(tabloid.Submissions || [])}
                            </div>
                        </div>

                        {/* Tareas del tabloide */}
                        {tabloid.HomeWork && tabloid.HomeWork.length > 0 && (
                            <div>
                                <h4 style={{ 
                                    color: 'var(--muted-foreground)',
                                    marginBottom: '1rem'
                                }}>
                                    Tareas
                                </h4>
                                <div style={{
                                    display: 'grid',
                                    gap: '0.75rem'
                                }}>
                                    {tabloid.HomeWork.map((hw, hwIndex) => (
                                        hw.assigment && (
                                            <div key={hwIndex} style={{
                                                padding: '1rem',
                                                backgroundColor: 'var(--background)',
                                                borderRadius: '0.5rem',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    <strong style={{ color: 'var(--foreground)' }}>
                                                        {hw.assigment.Name}
                                                    </strong>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '1rem',
                                                        alignItems: 'center'
                                                    }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            backgroundColor: 'var(--muted)',
                                                            color: 'var(--foreground)',
                                                            borderRadius: '0.25rem',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {hw.assigment.Status || 'Pendiente'}
                                                        </span>
                                                        {hw.assigment.Grade && (
                                                            <span style={{
                                                                padding: '0.25rem 0.75rem',
                                                                backgroundColor: getGradeColor(hw.assigment.Grade),
                                                                color: 'var(--primary-foreground)',
                                                                borderRadius: '0.25rem',
                                                                fontWeight: 'bold',
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                {hw.assigment.Grade}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {hw.assigment.Feedback && (
                                                    <p style={{
                                                        color: 'var(--muted-foreground)',
                                                        fontSize: '0.875rem',
                                                        marginTop: '0.5rem'
                                                    }}>
                                                        <strong>Feedback:</strong> {hw.assigment.Feedback}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {tabloids.length === 0 && (
                    <div style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--muted-foreground)',
                        backgroundColor: 'var(--card)',
                        borderRadius: '1rem',
                        border: '2px solid var(--border)'
                    }}>
                        No estás inscrito en ningún tabloide actualmente.
                    </div>
                )}
            </div>

            {/* Información de Pagos */}
            {userData.payments && userData.payments.length > 0 && (
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '1rem',
                    border: '2px solid var(--border)'
                }}>
                    <h2 style={{ 
                        color: 'var(--primary)',
                        marginBottom: '1rem'
                    }}>
                        Estado de Pagos
                    </h2>
                    <div style={{
                        display: 'grid',
                        gap: '0.75rem'
                    }}>
                        {userData.payments.map((payment, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                backgroundColor: 'var(--background)',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <strong style={{ color: 'var(--foreground)' }}>
                                        Pago #{index + 1}
                                    </strong>
                                    <p style={{ 
                                        color: 'var(--muted-foreground)',
                                        fontSize: '0.875rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        Referencia: {payment.payRef}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: payment.status === 'paid' ? 'var(--green-500)' : 
                                                   payment.status === 'pending' ? 'var(--blue-400)' : 'var(--red-500)',
                                    color: 'var(--primary-foreground)',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.875rem',
                                    textTransform: 'capitalize'
                                }}>
                                    {payment.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}