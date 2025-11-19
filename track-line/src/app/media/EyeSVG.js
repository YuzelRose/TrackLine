export default function EyeSVG({onClick}){
    return(
        <svg
            id="injected-svg"
            className="eye"
            width="24"
            height="24"
            title="Ocultar contraseña"
            fill="currentColor"
            viewBox="0 0 24 24"
            onClick={onClick}
            style={{cursor: "pointer"}}
        >
            <path d="M12 19c7.63 0 9.93-6.62 9.95-6.68.07-.21.07-.43 0-.63-.02-.07-2.32-6.68-9.95-6.68s-9.93 6.61-9.95 6.67c-.07.21-.07.43 0 .63.02.07 2.32 6.68 9.95 6.68Zm0-10c1.64 0 3 1.36 3 3s-1.36 3-3 3-3-1.36-3-3 1.36-3 3-3"></path>
        </svg>
    )
}