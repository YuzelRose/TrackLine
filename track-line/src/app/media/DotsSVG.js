'use client'
import { useRouter } from 'next/navigation'

export default function DotsSVG (url) {
    const navigate = useRouter();

    const handleClick = () => { 
        navigate.push(`/tabloid/opc?id=${url}`); 
    }
    return(
        <svg
            id="injected-svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={handleClick}
        >
            <path d="M10 10h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4z"></path>
        </svg>
    )
}