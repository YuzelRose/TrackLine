'use client'
import { useState } from 'react';
import { peticion, uploadFiles } from '@/app/utils/Funtions';
import FileDropZone from '../uI/inputs/FileDropZone';
import { useSearchParams } from 'next/navigation';
import styles from './css/notice-form.module.css'

export default function NoticeForm({reload}) {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        contentType: 'text' // 'text', 'file'
    });
    
    const searchParams = useSearchParams();
    const tabloidId = searchParams.get('id');

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
        if (selectedFiles.length > 0) {
            setFormData(prev => ({ ...prev, contentType: 'file' }));
        }
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
        
        if (!formData.name.trim()) {
            alert('El nombre del aviso es requerido');
            return;
        }

        if (!tabloidId) {
            alert('No se encontró el ID del tabloid');
            return;
        }

        setUploading(true);

        try {
            let response
            if (formData.content) {
                // Crear aviso de texto
                response = await peticion('tabloid/create-notice/text', {
                    data: {
                        Name: formData.name,
                        textContent: formData.content,
                        tabloidId: tabloidId
                    }
                }, 'POST');
            } else {
                alert('Por favor, proporciona contenido para el aviso');
                return;
            }

            if (response.httpStatus === 201 || response) {
                reload()
                alert('Aviso creado exitosamente');
                setFormData({ name: '', content: '', contentType: 'text' });
                setFiles([]);
            } else {
                alert('Error: ' + response.message);
            }
        } catch (error) {
            alert('Error al crear aviso: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} id={styles.form}>
            <h3>Crear Nuevo Aviso</h3>
            
            <div>
                <label>Título del Aviso:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ingresa el título del aviso"
                    required
                    className={styles.input}
                />
            </div>

            {formData.contentType === 'text' && (
                <div>
                    <label>Contenido:</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Escribe el contenido del aviso..."
                        rows="4"
                        className={styles.input}
                    />
                </div>
            )}

            {formData.contentType === 'file' && (
                <div id={styles.dropZone}>
                    <label>Archivos:</label>
                    <FileDropZone onFilesSelected={handleFilesSelected} />
                    {files.length > 0 && (
                        <p>{files.length} archivo(s) seleccionado(s)</p>
                    )}
                </div>
            )}

            <button type="submit" disabled={uploading} className='button'>
                {uploading ? 'Creando aviso...' : 'Crear Aviso'}
            </button>
        </form>
    );
}