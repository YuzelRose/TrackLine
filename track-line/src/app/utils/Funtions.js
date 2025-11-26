import axios from "axios"

export const minDate18YO = (birthDate) =>{
    const birth = new Date(birthDate);
    const today = new Date();
    const min = new Date(
        today.getFullYear()-18,
        today.getMonth(),
        today.getDate()
    );
    return birth > min
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

// Esta función es para SUBIR archivos (POST)
// En utils/Funtiones.js
export const uploadFiles = async (endpoint, formData) => {
    const URI = `${URI_START}/trckln/${endpoint}`;
    try {
        const response = await fetch(URI, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return await response.json();
        
    } catch(exError) {
        console.error('Error en petición de subida:', exError);
        throw new Error(exError.message || 'Error al subir los archivos');
    }
}

export const fetchData = async (endpoint, fileName) => {
    const URI = `${URI_START}/trckln/${endpoint}`
    try {
        const response = await fetch(URI);
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            alert(`Error ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Crear y disparar la descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Descarga completada' };
        
    } catch(exError) {
        console.error('Error en petición:', exError);
        throw new Error(exError.message || 'Error al descargar el archivo');
    }
}