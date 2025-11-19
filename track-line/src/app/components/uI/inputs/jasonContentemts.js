export const DROPUSERS = [ 
    { id: 1, text: "Estudiante", type: "student", textBool: true},
    { id: 2, text: "Tutor", type: "tutor", textBool: true},
]
export const STUDENTS = [
    {id: 1, name: "Name", placeholder: "Nombre", req: true, textBool: true},
    {id: 2, name: "Email", placeholder: "Correo", req: true, type: "email", textBool: true},
    {id: 3, name: "CURP", placeholder: "CURP", req: true, textBool: true},
    {id: 4, name: "Birth", req: true, text: "Fecha nac.", type: "date", textBool: true, title: "Ingrese su fecha de nacimiento en formato AAAA-MM-DD"},
]
export const TUTORFILDS = [
    {id: 1, name: "Tutor-Name", placeholder: "Nombre", req: true, textBool: true},
    {id: 2, name: "Tutor-Email", placeholder: "Correo", req: true, type: "email", textBool: true},
    {id: 3, name: "Tutor-CURP", placeholder: "CURP", req: true, textBool: true},
    {id: 4, name: "Tutor-Birth", req: true, text: "Fecha nac.", type: "date", textBool: true, title: "Ingrese su fecha de nacimiento en formato AAAA-MM-DD"},
    {id: 5, name: "Tutor-Phone", placeholder: "Telefono", req: true, type: "tel", textBool: true},
    {id: 6, name: "Tutor-RelatedEmail", placeholder: "Correo del estudiante", req: true, type: "email", textBool: true},
]
export const MAIN = [ 
    {id: 1, name: "user", placeholder: "Correo", req: true, type: "email"}
]