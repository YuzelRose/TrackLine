'use client'
import { useRouter } from 'next/navigation'

export default function Notice({data = []}) {
    const navigate = useRouter();    
    return(
        <>
            {data ? 
                data.map(notice => (
                    <article 
                        key={notice._id}
                        onClick={() => navigate.push(`/tabloid/`)} 
                    >
                        
                    </article>
                ))
            : null }
        </>
    )
}