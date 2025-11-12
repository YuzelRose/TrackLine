import axios from "axios"

export const minDate18YO = (birthDate) =>{
    const birth = new Date(birthDate);
    const today = new Date();
    const min = new Date(
        today.getFullYear()-18,
        today.getMonth(),
        today.getDate()
    );
    return birth <= min
}

const URI_START = process.env.NEXT_PUBLIC_BACK_URL || 'https://track-line.com'
export const peticion = async (endpoint, data = null, method = 'POST') => {
    const URI = `${URI_START}/trckln/${endpoint}`
    try {
        const config = {
            method,
            url: URI,
            data
        }
        const response = await axios(config);
        return {
            data: response.data,
            message: response.data?.message || 'Petición exitosa',
            status: true,
            httpStatus: response.status
        }
    } catch(exError) { // Manejo de errores
        console.error('Error en petición:', exError)
        if (exError.response) { // Error con respuesta del servidor
            const status = exError.response.status
            const serverMessage = exError.response.data?.message
            let userMessage
            if (status === 401) {
                userMessage = 'No autorizado'
            } else if (status === 404) {
                userMessage = 'Recurso no encontrado'
            } else if (status >= 500) {
                userMessage = 'Error interno del servidor'
            } else {
                userMessage = serverMessage || 'Error en la petición'
            }
            return { // Error con estatus
                data: null,
                message: userMessage,
                status: false,
                httpStatus: status,
                error: exError.response.data
            };
        } else if (exError.request) {// Error de red (sin respuesta)
            return {
                data: null,
                message: 'Error de conexión. Verifique su internet.',
                status: false,
                httpStatus: null
            };
        } else { // Error en la configuración
            return {
                data: null,
                message: 'Error en la configuración de la petición',
                status: false,
                httpStatus: null
            };
        }
    }
}