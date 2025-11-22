'use client'
import { useRouter } from 'next/navigation'

export default function DotsSVG ({url, height="1em"}) {
    const navigate = useRouter();

    const handleClick = (e) => { 
        e.stopPropagation()
        navigate.push(`/tabloid/opc?id=${url}`); 
    }
    return(
        <svg
            id="injected-svg"
            className='dot-container'
            height={height}
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={handleClick}
        >
            <path d="M10 10h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4z"></path>
        </svg>
    )
}