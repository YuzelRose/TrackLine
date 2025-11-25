'use client'
import { peticion } from '@/app/utils/Funtions';
import FileDropZone from '../uI/inputs/FileDropZone';
import styles from './css/submition.module.css'
import { useState } from "react";
import FileOBJ from '../uI/object/FileOBJ';

export default function Submition({data, DueDate, hwID}) {
    const [files, setFiles] = useState([]);
    const [button, setButton] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        formData.append('StudentID', data.Student);

        try {
            const response = await peticion('tabloid/send-hw', formData);
            
            if (response.httpStatus === 200) {
                alert('Archivos subidos correctamente');
                setFiles([]);
                setButton(false);
                window.location.reload();
            } else {
                alert('Error: ' + response.message);
            }
        } catch (error) {
            alert('Error al subir archivos');
        } finally {
            setUploading(false);
        }
    }
    
    return(
        <section id={styles.submitions}>
            <form onSubmit={handleSubmit} className={styles.bg} id={styles.form}>
                <p>
                    Fecha limite: {new Date(DueDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                <p>Entrega: {data.Status}</p>
                {data.SubmittedWork && !button?
                    <div id={styles.filesWrapper}>
                        <FileOBJ data={data.SubmittedWork}/>
                    </div>
                : null}
                {!button?
                    <button className='button' onClick={() => setButton(true)}>
                        {data.SubmittedWork? "Modificar envio" : "+ cargar archivos"}
                    </button>
                : 
                    <>
                        <FileDropZone onFilesSelected={handleFilesSelected} />
                        <button className='button' onClick={()=>setButton(false)}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={uploading} className='button'>
                            {uploading ? 'Entregando...' : 'Entregar tarea'}
                        </button>
                    </>
                }
            </form>
            {data.Feedback || data.Grade?
                <div className={styles.bg} id={styles.feedback}>
                    <h4>Comentarios:</h4>
                    <p>{data.Feedback}</p>
                </div>
            : null }
        </section>
    )
}