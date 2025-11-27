'use client'
import { useState } from 'react';
import { peticion, uploadAssignment, uploadFiles } from '@/app/utils/Funtions';
import FileDropZone from '../uI/inputs/FileDropZone';
import { useSearchParams } from 'next/navigation';
import styles from './css/notice-form.module.css'

export default function AssigmentForm({reload}) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
        dueTime: '23:59'
    });
    
    const searchParams = useSearchParams();
    const tabloidId = searchParams.get('id');

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim() || !formData.dueDate) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        if (!tabloidId) {
            alert('No se encontró el ID del tabloid');
            return;
        }

        setUploading(true);

        try {
            // Combinar fecha y hora para DueDate
            const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
            
            let response;
            if (files.length > 0) {
                // Crear assignment con archivos - ENVIAR CAMPOS INDIVIDUALES
                const uploadFormData = new FormData();
                
                // Enviar cada campo individualmente en lugar de JSON
                uploadFormData.append('Name', formData.name);
                uploadFormData.append('Text', formData.description);
                uploadFormData.append('DueDate', dueDateTime.toISOString());
                uploadFormData.append('tabloidId', tabloidId);

                files.forEach(file => {
                    uploadFormData.append('homeworkFiles', file);
                });

                response = await uploadAssignment('tabloid/create-assigment/file', uploadFormData);
            } else {
                // Crear assignment sin archivos
                response = await peticion('tabloid/create-assigment/text', {
                    data: {
                        Name: formData.name,
                        Text: formData.description,
                        DueDate: dueDateTime.toISOString(),
                        tabloidId: tabloidId
                    }
                }, 'POST');
            }

            if (response.status) {
                reload()
                alert('Tarea creada exitosamente');
                setFormData({ 
                    name: '', 
                    description: '', 
                    dueDate: '', 
                    dueTime: '23:59' 
                });
                setFiles([]);
            } else {
                alert('Error: ' + response.message);
            }
        } catch (error) {
            alert('Error al crear tarea: ' + error.message);
        } finally {
            setUploading(false);
        }
    };
    // Fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];

    return (
        <form onSubmit={handleSubmit} id={styles.form}>
            <h3>Crear Nueva Tarea</h3>
            
            <div>
                <label>Nombre de la Tarea:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre de la tarea"
                    required
                    className={styles.input}
                />
            </div>

            <div>
                <label>Descripción:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe la tarea..."
                    rows="4"
                    required
                    className={styles.input}
                />
            </div>

            <div>
                <label>Fecha Límite:</label>
                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className={styles.input}
                />
            </div>

            <div>
                <label>Hora Límite:</label>
                <input
                    type="time"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                />
            </div>

            <div id={styles.dropZone}>
                <label>Archivos de Referencia (opcional):</label>
                <FileDropZone onFilesSelected={handleFilesSelected} />
                {files.length > 0 && (
                    <p>{files.length} archivo(s) de referencia seleccionado(s)</p>
                )}
            </div>

            <button type="submit" disabled={uploading} className='button'>
                {uploading ? 'Creando tarea...' : 'Crear Tarea'}
            </button>
        </form>
    );
}