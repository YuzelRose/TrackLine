"use client";
import { useState, useEffect } from 'react';
import styles from './css/tabloids-page.module.css';
import { peticion } from '@/app/utils/Funtions';

export default function TabloidsPage() {
  const [tabloids, setTabloids] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [professorsLoading, setProfessorsLoading] = useState(true);
  const [message, setMessage] = useState({
    message: '',
    state: false,
    type: '' // 'success' | 'error'
  });
  const [formData, setFormData] = useState({
    Name: '',
    Owner: '',
    description: ''
  });

  // Obtener todos los tabloides
  const fetchTabloids = async () => {
    setLoading(true);
    try {
      const response = await peticion('crud/tabloid/get-all', null, 'POST');
      console.log('Respuesta de tabloides:', response);
      
      if (response.success) {
        setTabloids(response.data || []);
        setMessage({ message: '', state: false, type: '' });
      } else {
        setMessage({ 
          message: response.message || 'Error al cargar tabloides', 
          state: true,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error en fetchTabloids:', error);
      setMessage({ 
        message: 'Error de conexión al cargar tabloides', 
        state: true,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de profesores
  const fetchProfessors = async () => {
    setProfessorsLoading(true);
    try {
      const response = await peticion('crud/tabloid/professors', null, 'GET');
      console.log('Respuesta de profesores:', response);
      
      if (response.success) {
        setProfessors(response.data || []);
        setMessage({ message: '', state: false, type: '' });
      } else {
        console.error('Error al cargar profesores:', response.message);
        setMessage({ 
          message: 'Error al cargar lista de profesores', 
          state: true,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error en fetchProfessors:', error);
      setMessage({ 
        message: 'Error de conexión al cargar profesores', 
        state: true,
        type: 'error'
      });
    } finally {
      setProfessorsLoading(false);
    }
  };

  // Crear tabloide
  const createTabloid = async (e) => {
    e.preventDefault();
    
    if (!formData.Name || !formData.Owner || !formData.description) {
      setMessage({ 
        message: 'Todos los campos son requeridos', 
        state: true,
        type: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Enviando datos:', formData);
      const response = await peticion('crud/tabloid/create', { data: formData }, 'POST');
      console.log('Respuesta crear tabloide:', response);
      
      if (response.success) {
        setMessage({ 
          message: response.message || 'Tabloide creado exitosamente', 
          state: true,
          type: 'success'
        });
        // Resetear formulario
        setFormData({
          Name: '',
          Owner: '',
          description: ''
        });
        fetchTabloids();
      } else {
        setMessage({ 
          message: response.message || 'Error al crear tabloide', 
          state: true,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error en createTabloid:', error);
      setMessage({ 
        message: 'Error de conexión al crear tabloide: ' + error.message, 
        state: true,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tabloide
  const deleteTabloid = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este tabloide?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await peticion('crud/tabloid/drop', { id }, 'POST');
      console.log('Respuesta eliminar:', response);
      
      if (response.success) {
        setMessage({ 
          message: response.message || 'Tabloide eliminado exitosamente', 
          state: true,
          type: 'success'
        });
        fetchTabloids();
      } else {
        setMessage({ 
          message: response.message || 'Error al eliminar tabloide', 
          state: true,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error en deleteTabloid:', error);
      setMessage({ 
        message: 'Error de conexión al eliminar tabloide', 
        state: true,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(function() {
    fetchTabloids();
    fetchProfessors();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Tabloides</h1>
      
      {/* Mensajes de estado */}
      {message.state && (
        <div className={`${styles.message} ${
          message.type === 'error' ? styles.messageError : styles.messageSuccess
        }`}>
          {message.message}
        </div>
      )}

      {/* Formulario para crear tabloide */}
      <form onSubmit={createTabloid} className={styles.form}>
        <h2>Agregar Nuevo Tabloide</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nombre del Tabloide</label>
            <input
              type="text"
              name="Name"
              placeholder="Nombre del tabloide"
              value={formData.Name}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Profesor Responsable</label>
            <select
              name="Owner"
              value={formData.Owner}
              onChange={handleInputChange}
              className={styles.input}
              required
              disabled={professorsLoading}
            >
              <option value="">{professorsLoading ? 'Cargando profesores...' : 'Selecciona un profesor'}</option>
              {professors.map((professor) => (
                <option key={professor._id} value={professor._id}>
                  {professor.Name} - {professor.Email} ({professor.RFC})
                </option>
              ))}
            </select>
            <div className={styles.helperText}>
              {professorsLoading ? 'Cargando...' : `${professors.length} profesores disponibles`}
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Descripción</label>
            <textarea
              name="description"
              placeholder="Descripción del tabloide"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              required
              rows="4"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={loading || professorsLoading || professors.length === 0}
        >
          {loading ? 'Creando...' : 'Crear Tabloide'}
        </button>
        
        {professors.length === 0 && !professorsLoading && (
          <div className={styles.warningText}>
            No hay profesores disponibles. Debe registrar profesores primero.
          </div>
        )}
      </form>

      {/* Lista de tabloides */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Lista de Tabloides</h2>
          <span className={styles.countBadge}>{tabloids.length} tabloides</span>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Cargando tabloides...</div>
        ) : (
          <div className={styles.tableContainer}>
            {tabloids.length === 0 ? (
              <div className={styles.emptyState}>
                No hay tabloides registrados
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Profesor</th>
                    <th>Email Profesor</th>
                    <th>RFC</th>
                    <th>Descripción</th>
                    <th>Tareas</th>
                    <th>Pagos Requeridos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tabloids.map(function(tabloid) {
                    const homeworkCount = tabloid.HomeWork?.length || 0;
                    const paymentCount = tabloid.requiredPayment?.length || 0;
                    
                    return (
                      <tr key={tabloid._id}>
                        <td>{tabloid.Name}</td>
                        <td>{tabloid.Owner?.Name || 'N/A'}</td>
                        <td>{tabloid.Owner?.Email || 'N/A'}</td>
                        <td>{tabloid.Owner?.RFC || 'N/A'}</td>
                        <td className={styles.descriptionCell}>
                          {tabloid.description && tabloid.description.length > 50 
                            ? tabloid.description.substring(0, 50) + '...' 
                            : tabloid.description || 'Sin descripción'}
                        </td>
                        <td>
                          <span className={styles.badge}>
                            {homeworkCount}
                          </span>
                        </td>
                        <td>
                          <span className={styles.badge}>
                            {paymentCount}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button 
                              className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
                              onClick={function() { deleteTabloid(tabloid._id); }}
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}