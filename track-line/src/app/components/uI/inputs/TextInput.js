'use client'
import styles from './css/inputs.module.css'
export default function TextForm({content}) {
    return(
        <>
            {content.map(inp => (
                <div key={inp.id} className={styles.textContent}>
                    <p>
                        {inp.text? inp.text : inp.placeholder}
                    </p>
                    <span className={`group ${styles.in}`}>
                        <input  
                            type={inp.type? inp.type : "text"}
                            name={inp.name} 
                            placeholder={inp.placeholder} 
                            {...(inp.req && { required: true })}
                            {...(inp.red && {
                                readOnly: true, 
                                style: { 
                                    filter: 'brightness(0.8)',
                                    WebkitFilter: 'brightness(0.8)',
                                    cursor: 'not-allowed'
                                }
                            })}
                            className='group-text' 
                            defaultValue={inp.value? inp.value : ''} />
                    </span>
                </div>
            ))}
        </>
    )
}