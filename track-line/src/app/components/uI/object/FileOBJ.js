import FileSVG from '@/app/media/FileSVG'
import styles from './css/file.module.css'
import { fetchData } from '@/app/utils/Funtions';
export default function FileOBJ({data, type=1}) {
    const Download = async (contentId, fileName) => {
        try {
            await fetchData(`content/download/${contentId}`, fileName);
        } catch (error) {
            console.error('Error descargando archivo:', error);
            alert('Error al descargar el archivo');
        }
    }
    if(type===1) {
        return(
            data.map(file => (  
                <article 
                    key={file.file._id}
                    className={`${styles.file} ${styles.f}`}
                    onClick={() => Download(file.file._id, file.file.Name)} 
                    title={file.file.Name}
                >
                    <FileSVG clname={styles.fileSVG} width={"40"}/>            
                    <span>{file.file.Name}</span>
                </article>
            ))
        )
    } else {
        return(
            data.map(file => (  
                <>
                    <article 
                        key={file.file._id}
                        className={`${styles.file2} ${styles.f}`} 
                        onClick={() => Download(file.file._id, file.file.Name)} 
                        title={file.file.Name}
                    >
                        <FileSVG clname={styles.fileSVG} width={"60"}/>
                        <span className={styles.Name}>{file.file.Name}</span>
                    </article>
                </>
            ))
        )
    }
}