"use client";
import { useState, useEffect } from 'react';
import '../css/userCss.css';
import { peticion } from '@/app/utils/Funtions';

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
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
    UserType: 'tutor',
    Phone: '',
    RelatedEmail: ''
  });

  // Obtener todos los tutores
  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await peticion('crudTutor/tutors', null, 'GET');
      
      if (response.status) {
        setTutors(response.data.data || []);
        setMessage({ message: '', state: false });
      } else {
        setMessage({ 
          message: response.message || 'Error al cargar tutores', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al cargar tutores', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear tutor
  const createTutor = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await peticion('crudTutor/tutors', { data: formData }, 'POST');
      
      if (response.status) {
        setMessage({ 
          message: response.message || 'Tutor creado exitosamente', 
          state: true 
        });
        // Resetear formulario
        setFormData({
          Name: '',
          Email: '',
          Pass: '',
          CURP: '',
          Birth: '',
          UserType: 'tutor',
          Phone: '',
          RelatedEmail: ''
        });
        fetchTutors();
      } else {
        setMessage({ 
          message: response.message || 'Error al crear tutor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al crear tutor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tutor
  const deleteTutor = async (id) => {
    if (confirm('¿Estás seguro de eliminar este tutor?')) {
      setLoading(true);
      try {
        const response = await peticion(`crudTutor/tutors/${id}`, null, 'DELETE');
        
        if (response.status) {
          setMessage({ 
            message: response.message || 'Tutor eliminado exitosamente', 
            state: true 
          });
          fetchTutors();
        } else {
          setMessage({ 
            message: response.message || 'Error al eliminar tutor', 
            state: true 
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ 
          message: 'Error de conexión al eliminar tutor', 
          state: true 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Actualizar tutor
  const updateTutor = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await peticion(`crudTutor/tutors/${id}`, { data: updatedData }, 'PUT');
      
      if (response.status) {
        setMessage({ 
          message: response.message || 'Tutor actualizado exitosamente', 
          state: true 
        });
        fetchTutors();
      } else {
        setMessage({ 
          message: response.message || 'Error al actualizar tutor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al actualizar tutor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar tutor por email
  const searchByEmail = async (email) => {
    setLoading(true);
    try {
      const response = await peticion(`crudTutor/tutors/email/${email}`, null, 'GET');
      
      if (response.status) {
        if (response.data.data) {
          setTutors([response.data.data]);
        } else {
          setTutors([]);
        }
        setMessage({ 
          message: response.data.data ? 'Tutor encontrado' : 'No se encontró el tutor', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar tutor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar tutor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar tutor por teléfono
  const searchByPhone = async (phone) => {
    setLoading(true);
    try {
      const response = await peticion(`crudTutor/tutors/phone/${phone}`, null, 'GET');
      
      if (response.status) {
        if (response.data.data) {
          setTutors([response.data.data]);
        } else {
          setTutors([]);
        }
        setMessage({ 
          message: response.data.data ? 'Tutor encontrado' : 'No se encontró el tutor', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar tutor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar tutor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar tutor por email relacionado
  const searchByRelatedEmail = async (relatedEmail) => {
    setLoading(true);
    try {
      const response = await peticion(`crudTutor/tutors/related-email/${relatedEmail}`, null, 'GET');
      
      if (response.status) {
        if (response.data.data) {
          setTutors([response.data.data]);
        } else {
          setTutors([]);
        }
        setMessage({ 
          message: response.data.data ? 'Tutor encontrado' : 'No se encontró el tutor', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar tutor', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar tutor', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Resetear búsqueda y cargar todos
  const resetSearch = () => {
    fetchTutors();
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="crud-container ">
      <h1>Gestión de Tutores</h1>
      
      {/* Mensajes de estado */}
      {message.state && (
        <div className={`message ${message.message.includes('Error') ? 'error' : 'success'}`}>
          {message.message}
        </div>
      )}

      {/* Formulario para crear tutor */}
      <form onSubmit={createTutor} className="crud-form">
        <h2>Agregar Nuevo Tutor</h2>
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
              type="tel"
              placeholder="Teléfono"
              value={formData.Phone}
              onChange={(e) => setFormData({...formData, Phone: e.target.value})}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email relacionado (estudiante)"
              value={formData.RelatedEmail}
              onChange={(e) => setFormData({...formData, RelatedEmail: e.target.value})}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Tutor'}
        </button>
      </form>

      {/* Búsqueda de tutores */}
      <div className="search-section">
        <h3>Buscar Tutores</h3>
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
              type="tel"
              placeholder="Buscar por teléfono"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchByPhone(e.target.value);
                }
              }}
            />
            <button 
              type="button"
              onClick={() => {
                const phone = document.querySelector('input[placeholder="Buscar por teléfono"]').value;
                if (phone) searchByPhone(phone);
              }}
              className="btn btn-secondary"
            >
              Buscar por Teléfono
            </button>
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Buscar por email relacionado"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchByRelatedEmail(e.target.value);
                }
              }}
            />
            <button 
              type="button"
              onClick={() => {
                const relatedEmail = document.querySelector('input[placeholder="Buscar por email relacionado"]').value;
                if (relatedEmail) searchByRelatedEmail(relatedEmail);
              }}
              className="btn btn-secondary"
            >
              Buscar por Email Relacionado
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

      {/* Lista de tutores */}
      <div className="crud-list">
        <div className="list-header">
          <h2>Lista de Tutores</h2>
          <span className="count-badge">{tutors.length} tutores</span>
        </div>
        
        {loading ? (
          <div className="loading">Cargando tutores...</div>
        ) : (
          <div className="table-container">
            {tutors.length === 0 ? (
              <div className="empty-state">
                No hay tutores registrados
              </div>
            ) : (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>CURP</th>
                    <th>Teléfono</th>
                    <th>Email Relacionado</th>
                    <th>Fecha Nac.</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors.map((tutor) => (
                    <tr key={tutor._id}>
                      <td>{tutor.Name}</td>
                      <td>{tutor.Email}</td>
                      <td className="curp-cell">{tutor.CURP}</td>
                      <td>{tutor.Phone}</td>
                      <td>{tutor.RelatedEmail || 'N/A'}</td>
                      <td>{tutor.Birth ? new Date(tutor.Birth).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTutor(tutor._id)}
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