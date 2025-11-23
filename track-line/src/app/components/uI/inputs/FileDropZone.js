'use client'
import { useCallback, useState } from 'react';
import styles from './css/file-drop-zone.module.css';
import FileSVG from '@/app/media/FileSVG';
import XSVG from '@/app/media/XSVG';

export default function FileDropZone ({ onFilesSelected }) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    const dropFile = useCallback((index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles);
    }, [files, onFilesSelected]);

    const addFiles = useCallback((newFiles) => {
        const combinedFiles = [...files, ...newFiles];
        const uniqueFiles = combinedFiles.filter((file, index, self) => 
            index === self.findIndex(f => 
                f.name === file.name && f.size === file.size
            )
        );
        
        setFiles(uniqueFiles);
        onFilesSelected(uniqueFiles);
    }, [files, onFilesSelected]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files);
        addFiles(newFiles);
    }, [addFiles]); 

    const handleFileInput = useCallback((e) => {
        const newFiles = Array.from(e.target.files);
        addFiles(newFiles);
        e.target.value = '';
    }, [addFiles]); 

    return (
        <div className={styles.wrapperDropZone}>
            <div
                className={`${styles.dropArea} ${isDragging ? styles.dragging : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
            >
                <p>📁 Arrastra archivos aquí o</p>
                <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className={styles.hiddenInput}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className={styles.uploadLabel}>
                    Seleccionar archivos
                </label>
            </div>
            
            {files.length > 0 && (
                <div className={styles.selectedFiles}>
                    <p>Archivos seleccionados: {files.length}</p>
                    <ul>
                        {files.map((file, index) => (
                            <li 
                                key={index} 
                                className={styles.file}
                            >
                                <FileSVG clname={styles.fileSVG}/>
                                <span className={styles.fileName}>
                                    {file.name}
                                </span>
                                <XSVG clname={styles.x} onclick={() => dropFile(index)}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};