import UserIconSVG from "@/app/media/DefaultUserSVG"
import { useRouter } from "next/navigation"
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