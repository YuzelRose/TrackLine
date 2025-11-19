'use client'
import styles from './css/calendar.module.css'
import ArrowSVG from '@/app/media/ArrowSVG'
import { DAYS, MONTHS } from './jasonContentemts'
import { useState } from 'react'

export default function Calendar ({ onDateSelect, events = [], initialDate = new Date() }) {
    const [currentDate, setCurrentDate] = useState(new Date(initialDate))
    const [selectedDate, setSelectedDate] = useState(null)
    const [button, setButton] = useState(false)

    // Obtener primer día del mes y cantidad de días
    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        
        return {
            firstDay,
            lastDay,
            daysInMonth: lastDay.getDate(),
            startingDay: firstDay.getDay()
        }
    }

    // Navegación entre meses
    const prevMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        setCurrentDate(newDate)
        const today = new Date()
        setButton(!(today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear()));
    }
    const nextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        setCurrentDate(newDate)
        const today = new Date()
        setButton(!(today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear()))
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
        setButton(false)
    }

    // Seleccionar fecha
    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        setSelectedDate(newDate)
        if (onDateSelect) {
            onDateSelect(newDate)
        }
    }

    // Verificar si una fecha tiene eventos
    const hasEvents = (day) => {
        if (!events.length) return false
        
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        return events.some(event => 
            new Date(event.date).toDateString() === dateToCheck.toDateString()
        )
    }

    // Verificar si es hoy
    const isToday = (day) => {
        const today = new Date()
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
    }

    // Verificar si está seleccionada
    const isSelected = (day) => {
        if (!selectedDate) return false
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear()
    }

    // Generar días del mes
    const renderDays = () => {
        const { daysInMonth, startingDay } = getDaysInMonth(currentDate)
        const days = []

        // Días vacíos al inicio
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>)
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayClasses = [
                styles.day,
                isToday(day) ? styles.today : '',
                isSelected(day) ? styles.selected : '',
                hasEvents(day) ? styles.hasEvents : ''
            ].filter(Boolean).join(' ')

            days.push(
                <div
                    key={day}
                    className={dayClasses}
                    onClick={() => handleDateClick(day)}
                >
                    <span>{day}</span>
                    {hasEvents(day) && <div className={styles.eventIndicator}></div>}
                </div>
            )
        }

        return days
    }

    return ( // falta revisar que realmente muestre los eventos
        <section id={styles.main}>
            {events.length > 0 ? (
                <nav id={styles.homework} className={styles.conteiner}>
                    <h2 className={styles.header}>Actividades:</h2>
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={styles.eventIndicator}></div>
                            <span>Eventos/Tareas</span>
                        </div>
                    </div>
                </nav>
            ) : null}
            <div id={styles.calendar} className={styles.conteiner}>
                <div className={styles.header}>
                    <div onClick={prevMonth} className={styles.arrow} style={{ transform: 'rotate(180deg)' }}>
                        <ArrowSVG/>
                    </div>
                    <div className={styles.monthYear}>
                        <h2>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    </div>
                    <div onClick={nextMonth} className={styles.arrow}>
                        <ArrowSVG/>
                    </div>
                </div>
                {button ?
                    <div className={styles.todayButtonContainer}>
                        <button onClick={goToToday} className={styles.todayButton}>
                            Hoy
                        </button>
                    </div>
                : null}

                {/* Días de la semana */}
                <div className={styles.weekDays}>
                    {DAYS.map(day => (
                        <div key={day} className={styles.weekDay}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid de días */}
                <div className={styles.daysGrid}>
                    {renderDays()}
                </div>
            </div>
        </section>
    )
}