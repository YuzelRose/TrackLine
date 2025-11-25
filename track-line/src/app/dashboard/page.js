"use client";
import ProfesorSVG from '../media/ProfesorSVG';
import TutorSVG from '../media/TutorSVG';
import UsuariosSVG from '../media/UsuariosSVG';
import TabloidSVG from '../media/TabloidSVG';
import { useRouter } from 'next/navigation';
import styles from './css/dashboardCss.css';

export default function Dashboard(){
  const router = useRouter();
  

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Sistema Escolar</h1>
        <p>Gestiona estudiantes, profesores, tutores y tabloides</p>
      </div>

      <div className="crud-grid">
        <div className="crud-card student">
          <UsuariosSVG></UsuariosSVG>
          <h2>Gestión de Estudiantes</h2>
          <p>Administra la información de los estudiantes</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('./dashboard/user/student')} 
          >
            Administrar Estudiantes
          </button>
        </div>

        <div className="crud-card teacher">
          <ProfesorSVG className="crud-icon teacher"></ProfesorSVG>
          <h2>Gestión de Profesores</h2>
          <p>Gestiona el personal docente</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('./dashboard/user/teacher')}
          >
            Administrar Profesores
          </button>
        </div>

        <div className="crud-card tutor">
          <TutorSVG className="crud-icon tutor"></TutorSVG>
          <h2>Gestión de Tutores</h2>
          <p>Administra la información de los tutores</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('./dashboard/user/tutor')}
          >
            Administrar Tutores
          </button>
        </div>

        <div className="crud-card tabloid">
          <TabloidSVG className="crud-icon tabloid"></TabloidSVG>
          <h2>Gestión de Tabloides</h2>
          <p>Administra los tabloides y materiales educativos</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('./dashboard/tabloid')}
          >
            Administrar Tabloides
          </button>
        </div>
      </div>
    </div>
  );
}