"use client";
import { useState, useEffect } from 'react';
import '../user/css/userCss.css';
import { peticion } from '@/app/utils/Funtions';

function TabloidsPage() {
  const [tabloids, setTabloids] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [professorsLoading, setProfessorsLoading] = useState(true);
  const [message, setMessage] = useState({
    message: '',
    state: false
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
      const response = await peticion('crudTablo/tabloids', null, 'GET');
      console.log('Respuesta de tabloides:', response);
      
      if (response.success) {
        setTabloids(response.data || []);
        setMessage({ message: '', state: false });
      } else {
        setMessage({ 
          message: response.message || 'Error al cargar tabloides', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error en fetchTabloids:', error);
      setMessage({ 
        message: 'Error de conexión al cargar tabloides', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista de profesores
  const fetchProfessors = async () => {
    setProfessorsLoading(true);
    try {
      const response = await peticion('crudTablo/profesors', null, 'GET');
      console.log('Respuesta de profesores:', response);
      
      if (response.success) {
        setProfessors(response.data || []);
        setMessage({ message: '', state: false });
      } else {
        console.error('Error al cargar profesores:', response.message);
        setMessage({ 
          message: 'Error al cargar lista de profesores', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error en fetchProfessors:', error);
      setMessage({ 
        message: 'Error de conexión al cargar profesores', 
        state: true 
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
        state: true 
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Enviando datos:', formData);
      const response = await peticion('crudTablo/tabloids', { data: formData }, 'POST');
      console.log('Respuesta crear tabloide:', response);
      
      if (response.success) {
        setMessage({ 
          message: 'Tabloide creado exitosamente', 
          state: true 
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
          state: true 
        });
      }
    } catch (error) {
      console.error('Error en createTabloid:', error);
      setMessage({ 
        message: 'Error de conexión al crear tabloide: ' + error.message, 
        state: true 
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
      const response = await peticion('crudTablo/tabloids/' + id, null, 'DELETE');
      console.log('Respuesta eliminar:', response);
      
      if (response.success) {
        setMessage({ 
          message: 'Tabloide eliminado exitosamente', 
          state: true 
        });
        fetchTabloids();
      } else {
        setMessage({ 
          message: response.message || 'Error al eliminar tabloide', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error en deleteTabloid:', error);
      setMessage({ 
        message: 'Error de conexión al eliminar tabloide', 
        state: true 
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
    <div className="crud-container">
      <h1>Gestión de Tabloides</h1>
      
      {/* Mensajes de estado */}
      {message.state && (
        <div className={'message ' + (message.message.includes('Error') ? 'error' : 'success')}>
          {message.message}
        </div>
      )}

      {/* Formulario para crear tabloide */}
      <form onSubmit={createTabloid} className="crud-form">
        <h2>Agregar Nuevo Tabloide</h2>
        <div className="form-grid">
          <div className="input-group">
            <input
              type="text"
              name="Name"
              placeholder="Nombre del tabloide"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <select
              name="Owner"
              value={formData.Owner}
              onChange={handleInputChange}
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
            <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
              {professorsLoading ? 'Cargando...' : `${professors.length} profesores disponibles`}
            </div>
          </div>

          <div className="input-group full-width">
            <textarea
              name="description"
              placeholder="Descripción del tabloide"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || professorsLoading || professors.length === 0}
        >
          {loading ? 'Creando...' : 'Crear Tabloide'}
        </button>
        
        {professors.length === 0 && !professorsLoading && (
          <div style={{fontSize: '12px', color: '#ff6b6b', marginTop: '10px'}}>
            No hay profesores disponibles.
          </div>
        )}
      </form>

      {/* Lista de tabloides */}
      <div className="crud-list">
        <div className="list-header">
          <h2>Lista de Tabloides</h2>
          <span className="count-badge">{tabloids.length} tabloides</span>
        </div>
        
        {loading ? (
          <div className="loading">Cargando tabloides...</div>
        ) : (
          <div className="table-container">
            {tabloids.length === 0 ? (
              <div className="empty-state">
                No hay tabloides registrados
              </div>
            ) : (
              <table className="students-table">
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
                    return (
                      <tr key={tabloid._id}>
                        <td>{tabloid.Name}</td>
                        <td>{tabloid.Owner?.Name || 'N/A'}</td>
                        <td>{tabloid.Owner?.Email || 'N/A'}</td>
                        <td>{tabloid.Owner?.RFC || 'N/A'}</td>
                        <td className="description-cell">
                          {tabloid.description && tabloid.description.length > 50 
                            ? tabloid.description.substring(0, 50) + '...' 
                            : tabloid.description || 'Sin descripción'}
                        </td>
                        <td>{tabloid.HomeWork?.length || 0}</td>
                        <td>{tabloid.requiredPayment?.length || 0}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-danger btn-sm"
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

export default TabloidsPage;