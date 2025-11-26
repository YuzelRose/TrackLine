export const getMatchingBadges = (userBadges) => {
    const categorizedUserBadges = reedData(userBadges)
    const allBadgeDefinitions = {
        academicBadges,
        techBadges, 
        progressBadges,
        funBadges,
        socialBadges, // Añadido para completar
        generalBadges // Añadido para completar
    }
    const matchingBadges = categorizedUserBadges.map(userBadge => {
        const badgeDefinition = allBadgeDefinitions[userBadge.component]?.find(
            def => def.id === userBadge.refId
        )
        if (badgeDefinition) {
            return {
                ...userBadge,        
                ...badgeDefinition   
            }
        }
        return null
    }).filter(badge => badge !== null)
    return matchingBadges
}

const reedData = (data) => {
    return data.map(badge => {
        const prefix = badge.refId.split('-')[0]
        switch(prefix) {
            case 'aca':
                return { ...badge, component: 'academicBadges' }
            case 'tech':
                return { ...badge, component: 'techBadges' }
            case 'soc':
                return { ...badge, component: 'socialBadges' }
            case 'pro': 
                return { ...badge, component: 'progressBadges' }
            case 'fun':
                return { ...badge, component: 'funBadges' }
            default:
                return { ...badge, component: 'generalBadges' }
        }
    })
}

const academicBadges = [
    {
        id: "aca-Badg1",
        name: "Primer lugar",
        image: "🥇",
        criteria: "Obtener el promedio más alto del grupo"
    },
    {
        id: "aca-Badg2",
        name: "Asistencia perfecta",
        image: "📅", 
        criteria: "100% de asistencia en el mes"
    },
    {
        id: "aca-Badg3",
        name: "Tarea completada",
        image: "✅",
        criteria: "Entregar todas las tareas a tiempo por 2 semanas"
    },
    {
        id: "aca-Badg4",
        name: "Participación activa",
        image: "💬",
        criteria: "Participar en clase 5 días consecutivos"
    }
]

const techBadges = [
    {
        id: "tech-Badg1",
        name: "Bug Hunter",
        image: "🐛",
        criteria: "Encontrar y reportar un error en el sistema"
    },
    {
        id: "tech-Badg2",
        name: "Code Master",
        image: "👨‍💻",
        criteria: "Completar proyecto de programación antes de tiempo"
    },
    {
        id: "tech-Badg3",
        name: "Early Adopter",
        image: "🚀", 
        criteria: "Ser de los primeros en usar nueva funcionalidad"
    }
]

const progressBadges = [
    {
        id: "pro-Badg1",
        name: "Novato",
        image: "🌱",
        criteria: "Completar primer curso"
    },
    {
        id: "pro-Badg2",
        name: "Avanzado", 
        image: "⚡",
        criteria: "Completar 5 cursos"
    },
    {
        id: "pro-Badg3",
        name: "Experto",
        image: "🏆",
        criteria: "Completar todos los cursos del semestre"
    },
    {
        id: "pro-Badg4",
        name: "Racha de estudio",
        image: "🔥",
        criteria: "Acceder al sistema 7 días seguidos"
    }
]

const funBadges = [
    {
        id: "fun-Badg1",
        name: "Primer buen trabajo",
        image: "🎉",
        criteria: "Entrega tu primer trabajo"
    },
    {
        id: "fun-Badg2",
        name: "Explorador",
        image: "🧭",
        criteria: "Completar tu primer recorrido por la plataforma"
    },
    {
        id: "fun-Badg3",
        name: "Coleccionista",
        image: "🃏",
        criteria: "Obtener 5 badges diferentes"
    },
    {
        id: "fun-Badg4",
        name: "Estratega",
        image: "♟️",
        criteria: "Planificar y completar un objetivo semanal"
    },
    {
        id: "fun-Badg5",
        name: "Socializador",
        image: "🤝",
        criteria: "Interactuar con 3 compañeros diferentes"
    },
    {
        id: "fun-Badg6",
        name: "Creativo",
        image: "🎨",
        criteria: "Personalizar tu perfil por primera vez"
    }
]

// Añadí estas definiciones vacías para evitar errores
const socialBadges = [
    // Puedes añadir badges sociales aquí
]

const generalBadges = [
    // Puedes añadir badges generales aquí
]