'use client'
import { uploadFiles } from '@/app/utils/Funtions';
import FileDropZone from '../uI/inputs/FileDropZone';
import styles from './css/submition.module.css'
import { useState } from "react";
import FileOBJ from '../uI/object/FileOBJ';

export default function Submition({ data, DueDate, hwID, studentId }) {
    const [files, setFiles] = useState([]);
    const [button, setButton] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Validación segura de data - manejar tanto submissions vacías como null
    const submissionData = data || {};
    const status = submissionData.Status || 'No entregado';
    const submittedWork = submissionData.SubmittedWork || [];
    const feedback = submissionData.Feedback || '';
    const grade = submissionData.Grade;
    
    // Determinar si ya existe una submission
    const hasExistingSubmission = submissionData.Status && submissionData.Status !== 'No entregado';

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('workFiles', file);
        });

        formData.append('hwID', hwID);
        formData.append('StudentID', studentId); // Usar studentId directamente del prop

        try {
            const response = await uploadFiles('tabloid/send-hw', formData);
            
            if (response.status === 200) {
                alert('Archivos subidos correctamente');
                setFiles([]);
                setButton(false);
                window.location.reload();
            } else {
                alert('Error: ' + response.message);
            }
        } catch (error) {
            alert('Error al subir archivos: ' + error.message);
        } finally {
            setUploading(false);
        }
    }
    
    return(
        <section id={styles.submitions}>
            <form onSubmit={handleSubmit} className={styles.bg} id={styles.form}>
                <p>
                    Fecha limite: {DueDate ? 
                        new Date(DueDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        }) : 'No especificada'
                    }
                </p>
                <p>Estado: {status}</p>
                
                {submittedWork.length > 0 && !button && (
                    <div id={styles.filesWrapper}>
                        <FileOBJ data={submittedWork}/>
                    </div>
                )}
                
                {!button ? (
                    <button type="button" className='button' onClick={() => setButton(true)}>
                        {hasExistingSubmission ? "Modificar envío" : "+ cargar archivos"}
                    </button>
                ) : (
                    <>
                        <FileDropZone onFilesSelected={handleFilesSelected} />
                        <button type="button" className='button' onClick={() => setButton(false)}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={uploading || files.length === 0} className='button'>
                            {uploading ? 'Entregando...' : 'Entregar tarea'}
                        </button>
                    </>
                )}
            </form>
            
            {(feedback || grade !== undefined) && (
                <div className={styles.bg} id={styles.feedback}>
                    <h4>Comentarios:</h4>
                    {feedback && <p>{feedback}</p>}
                    {grade !== undefined && (
                        <p><strong>Calificación:</strong> {grade}</p>
                    )}
                </div>
            )}
        </section>
    )
}