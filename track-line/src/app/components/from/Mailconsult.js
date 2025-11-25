'use client'
import { peticion } from "@/app/utils/Funtions"
import { MAIN } from "../uI/inputs/jasonContentemts"
import TextForm from "../uI/inputs/TextInput"
import styles from './css/EmailButton.module.css'
export default function EmailButton() {
  const handleSubmit = async() => {
    try {
      const formData = new FormData(e.target)
      const email = formData.get('user')
      const response = await peticion('help/send-mail', {Email: email}) // falta dar de alta la ruta
      if(response.httpStatus === 200) alert('Revise su correo.')
      else alert('Error al enviar su correo.')
    } catch (error) {
      alert(error)
    }
  }
  return (
    <form onSubmit={handleSubmit} id={styles.form}>
      <TextForm content={MAIN} />
      <button type="submit" className="button">
        Solicitar informacion
      </button>
    </form>
  )
}