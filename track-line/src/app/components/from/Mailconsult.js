export default function EmailButton({ 
  email = "soporte@trackline.edu",
  subject = "Consulta TrackLine",
  body = "",
  children = "Contactar Soporte"
}) {
  const handleEmail = () => {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }

  return (
    <button onClick={handleEmail} className="button" id="button__contact">
      {children}
    </button>
  )
}