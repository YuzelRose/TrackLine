'use client'
import LoginUserSVG from '@/app/media/LoginUserSVG'
import styles from './css/inputs.module.css'
export default function TextForm({content, width}) {
    return(
        <>
            {content.map(inp => (
                <div 
                    key={inp.id} 
                    className={styles.textContent}
                    {...(inp.read && {
                        style: { 
                            filter: 'brightness(0.8)',
                            WebkitFilter: 'brightness(0.8)',
                        }
                    })}
                >
                    {inp.textBool?
                    <p> {inp.text? inp.text : inp.placeholder} </p>
                    :null }
                    <span 
                        className={`group ${styles.in}`}
                        style={{
                            maxWidth: width,
                            ...(inp.read && { cursor: 'not-allowed' })
                        }}
                    >
                        <input
                            title={inp.title}  
                            type={inp.type? inp.type : "text"}
                            name={inp.name} 
                            placeholder={inp.placeholder} 
                            {...(inp.req && { required: true })}
                            {...(inp.read && { readOnly: true })}
                            className='group-text' 
                            defaultValue={inp.value? inp.value : ''} 
                            {...(inp.read && {
                                style: { 
                                    cursor: 'not-allowed'
                                }
                            })}
                        />
                        {inp.type  === "email"? <LoginUserSVG/> : null}
                    </span>
                </div>
            ))}
        </>
    )
}