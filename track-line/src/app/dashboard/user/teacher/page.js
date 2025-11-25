"use client";
import { useState, useEffect } from 'react';
import '../css/userCss.css';
import { peticion } from '@/app/utils/Funtions';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    message: '',
    state: false
  });
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Pass: '',
    CURP: '',
    Birth: '',
    UserType: 'profesor',
    RFC: '',
    NCount: '',
    Cedula: '',
    Tabloid: []
  });

  // Obtener todos los profesores
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await ProfesorSVG.find('crudProfe/profesors', null, 'GET');
      
      if (response.status) {
        setTeachers(response.data.data || []);
        setMessage({ message: '', state: false });
      } else {
        setMessage({ 
          message: response.message || 'Error al cargar profesores', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al cargar profesores', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear profesor
  const createTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await peticion('crudProfe/profesors', { data: formData }, 'POST');
      
      if (response.status) {
        setMessage({ 
          message: response.message || 'Profesor creado exitosamente', 
          state: true 
        });
        // Resetear formulario
        setFormData({
          Name: '',
          Email: '',
          Pass: '',
          CURP: '',
          Birth: '',
          UserType: 'profesor',
          RFC: '',
          NCount: '',
          Cedula: '',
          Tabloid: []
        });
        fetchTeachers();
      } else {
        setMessage({ 
          message: response.message || 'Error al crear profesor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al crear profesor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar profesor
  const deleteTeacher = async (id) => {
    if (confirm('¿Estás seguro de eliminar este profesor?')) {
      setLoading(true);
      try {
        const response = await peticion(`crudProfe/profesor/${id}`, null, 'DELETE');
        
        if (response.status) {
          setMessage({ 
            message: response.message || 'Profesor eliminado exitosamente', 
            state: true 
          });
          fetchTeachers();
        } else {
          setMessage({ 
            message: response.message || 'Error al eliminar profesor', 
            state: true 
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ 
          message: 'Error de conexión al eliminar profesor', 
          state: true 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Actualizar profesor
  const updateTeacher = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await peticion(`crudProfe/profesor/${id}`, { data: updatedData }, 'PUT');
      
      if (response.status) {
        setMessage({ 
          message: response.message || 'Profesor actualizado exitosamente', 
          state: true 
        });
        fetchTeachers();
      } else {
        setMessage({ 
          message: response.message || 'Error al actualizar profesor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al actualizar profesor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar profesor por email
  const searchByEmail = async (email) => {
    setLoading(true);
    try {
      const response = await peticion(`crudProfe/profesors/email/${email}`, null, 'GET');
      
      if (response.status) {
        if (response.data.data) {
          setTeachers([response.data.data]);
        } else {
          setTeachers([]);
        }
        setMessage({ 
          message: response.data.data ? 'Profesor encontrado' : 'No se encontró el profesor', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar profesor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar profesor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar profesor por RFC
  const searchByRFC = async (rfc) => {
    setLoading(true);
    try {
      const response = await peticion(`crudProfe/profesors/rfc/${rfc}`, null, 'GET');
      
      if (response.status) {
        if (response.data.data) {
          setTeachers([response.data.data]);
        } else {
          setTeachers([]);
        }
        setMessage({ 
          message: response.data.data ? 'Profesor encontrado' : 'No se encontró el profesor', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar profesor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar profesor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Resetear búsqueda y cargar todos
  const resetSearch = () => {
    fetchTeachers();
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="crud-container">
      <h1>Gestión de Profesores</h1>
      
      {/* Mensajes de estado */}
      {message.state && (
        <div className={`message ${message.message.includes('Error') ? 'error' : 'success'}`}>
          {message.message}
        </div>
      )}

      {/* Formulario para crear profesor */}
      <form onSubmit={createTeacher} className="crud-form">
        <h2>Agregar Nuevo Profesor</h2>
        <div className="form-grid">
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.Name}
              onChange={(e) => setFormData({...formData, Name: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.Email}
              onChange={(e) => setFormData({...formData, Email: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.Pass}
              onChange={(e) => setFormData({...formData, Pass: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="CURP"
              value={formData.CURP}
              onChange={(e) => setFormData({...formData, CURP: e.target.value})}
              required
              maxLength={18}
            />
          </div>

          <div className="input-group">
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={formData.Birth}
              onChange={(e) => setFormData({...formData, Birth: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="RFC"
              value={formData.RFC}
              onChange={(e) => setFormData({...formData, RFC: e.target.value})}
              required
              maxLength={13}
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Número de Cuenta"
              value={formData.NCount}
              onChange={(e) => setFormData({...formData, NCount: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Cédula Profesional"
              value={formData.Cedula}
              onChange={(e) => setFormData({...formData, Cedula: e.target.value})}
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Profesor'}
        </button>
      </form>

      {/* Búsqueda de profesores */}
      <div className="search-section">
        <h3>Buscar Profesores</h3>
        <div className="search-options">
          <div className="input-group">
            <input
              type="email"
              placeholder="Buscar por email"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchByEmail(e.target.value);
                }
              }}
            />
            <button 
              type="button"
              onClick={() => {
                const email = document.querySelector('input[placeholder="Buscar por email"]').value;
                if (email) searchByEmail(email);
              }}
              className="btn btn-secondary"
            >
              Buscar por Email
            </button>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Buscar por RFC"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchByRFC(e.target.value);
                }
              }}
            />
            <button 
              type="button"
              onClick={() => {
                const rfc = document.querySelector('input[placeholder="Buscar por RFC"]').value;
                if (rfc) searchByRFC(rfc);
              }}
              className="btn btn-secondary"
            >
              Buscar por RFC
            </button>
          </div>
          
          <button 
            type="button"
            onClick={resetSearch}
            className="btn btn-outline"
          >
            Mostrar Todos
          </button>
        </div>
      </div>

      {/* Lista de profesores */}
      <div className="crud-list">
        <div className="list-header">
          <h2>Lista de Profesores</h2>
          <span className="count-badge">{teachers.length} profesores</span>
        </div>
        
        {loading ? (
          <div className="loading">Cargando profesores...</div>
        ) : (
          <div className="table-container">
            {teachers.length === 0 ? (
              <div className="empty-state">
                No hay profesores registrados
              </div>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>CURP</th>
                    <th>RFC</th>
                    <th>N° Cuenta</th>
                    <th>Cédula</th>
                    <th>Fecha Nac.</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>{teacher.Name}</td>
                      <td>{teacher.Email}</td>
                      <td className="curp-cell">{teacher.CURP}</td>
                      <td className="curp-cell">{teacher.RFC}</td>
                      <td>{teacher.NCount}</td>
                      <td>{teacher.Cedula}</td>
                      <td>{teacher.Birth ? new Date(teacher.Birth).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTeacher(teacher._id)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}