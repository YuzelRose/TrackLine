import UserIconSVG from "@/app/media/defaultUserSVG"
import { useRouter } from "next/navigation"
import styles from "./css/ui.module.css"
export default function Profile() {
    const router = useRouter()
    const handleNavigate = () => {
        router.push('/profile/blank')
    }
    return(
        <figure id='profile' onClick={handleNavigate}>
            <UserIconSVG/>
        </figure>
    )
}