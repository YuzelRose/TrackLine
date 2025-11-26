"use client";
import { useState, useEffect } from 'react';
import styles from './css/user.module.css';
import { peticion } from '@/app/utils/Funtions';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: '', state: false });
  const [userType, setUserType] = useState('all'); // 'all', 'student', 'teacher', 'tutor'
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pass: '',
    curp: '',
    birth: '',
    userType: 'student',
    kardex: '',
    relatedEmail: '',
    rfc: '',
    nCount: '',
    cedula: '',
    phone: ''
  });

  // Obtener todos los usuarios
  const fetchUsers = async (type = 'all') => {
    setLoading(true);
    try {
      const response = await peticion('crud/user/get-all', { type }, 'POST');
      
      if (response.status === 200) {
        setUsers(response.data || []);
        setFilteredUsers(response.data || []);
        setMessage({ message: '', state: false });
      } else {
        setMessage({ 
          message: response.message || 'Error al cargar usuarios', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al cargar usuarios', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await peticion('crud/user/create', { data: formData }, 'POST');
      
      if (response.status === 201) {
        setMessage({ 
          message: response.message || 'Usuario creado exitosamente', 
          state: true 
        });
        // Resetear formulario
        setFormData({
          name: '',
          email: '',
          pass: '',
          curp: '',
          birth: '',
          userType: 'student',
          kardex: '',
          relatedEmail: '',
          rfc: '',
          nCount: '',
          cedula: '',
          phone: ''
        });
        fetchUsers(userType);
      } else {
        setMessage({ 
          message: response.message || 'Error al crear usuario', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al crear usuario', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setLoading(true);
      try {
        const response = await peticion('crud/user/drop', { id }, 'POST');
        
        if (response.status === 200) {
          setMessage({ 
            message: response.message || 'Usuario eliminado exitosamente', 
            state: true 
          });
          fetchUsers(userType);
        } else {
          setMessage({ 
            message: response.message || 'Error al eliminar usuario', 
            state: true 
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ 
          message: 'Error de conexión al eliminar usuario', 
          state: true 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Buscar usuarios
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      fetchUsers(userType);
      return;
    }

    setLoading(true);
    try {
      const searchData = { Type: userType === 'all' ? undefined : userType };
      
      if (searchField === 'email') searchData.Email = searchTerm;
      if (searchField === 'name') searchData.Name = searchTerm;
      if (searchField === 'kardex') searchData.kardex = searchTerm;
      if (searchField === 'rfc') searchData.RFC = searchTerm;

      const response = await peticion('crud/user/find-by', { data: searchData }, 'POST');
      
      if (response.status === 200) {
        setFilteredUsers(response.data || []);
        setMessage({ 
          message: response.data && response.data.length > 0 ? 'Usuario(s) encontrado(s)' : 'No se encontraron usuarios', 
          state: true 
        });
      } else {
        setMessage({ 
          message: response.message || 'Error al buscar usuarios', 
          state: true 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        message: 'Error de conexión al buscar usuarios', 
        state: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por tipo
  const filterByType = (type) => {
    setUserType(type);
    if (type === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.UserType === type);
      setFilteredUsers(filtered);
    }
  };

  // Resetear búsqueda
  const resetSearch = () => {
    setSearchTerm('');
    setSearchField('name');
    fetchUsers(userType);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Campos específicos por tipo de usuario
  const getTypeSpecificFields = () => {
    switch (formData.userType) {
      case 'student':
        return (
          <>
            <div className={styles.inputGroup}>
              <label>Kardex</label>
              <input
                type="text"
                placeholder="Kardex del estudiante"
                value={formData.kardex}
                onChange={(e) => setFormData({...formData, kardex: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email del Tutor</label>
              <input
                type="email"
                placeholder="Email del tutor"
                value={formData.relatedEmail}
                onChange={(e) => setFormData({...formData, relatedEmail: e.target.value})}
                className={styles.input}
              />
            </div>
          </>
        );
      case 'teacher':
        return (
          <>
            <div className={styles.inputGroup}>
              <label>RFC</label>
              <input
                type="text"
                placeholder="RFC del profesor"
                value={formData.rfc}
                onChange={(e) => setFormData({...formData, rfc: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Número de Cuenta</label>
              <input
                type="text"
                placeholder="Número de cuenta"
                value={formData.nCount}
                onChange={(e) => setFormData({...formData, nCount: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Cédula</label>
              <input
                type="text"
                placeholder="Cédula profesional"
                value={formData.cedula}
                onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                className={styles.input}
              />
            </div>
          </>
        );
      case 'tutor':
        return (
          <>
            <div className={styles.inputGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                placeholder="Teléfono del tutor"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email Relacionado</label>
              <input
                type="email"
                placeholder="Email relacionado"
                value={formData.relatedEmail}
                onChange={(e) => setFormData({...formData, relatedEmail: e.target.value})}
                className={styles.input}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Usuarios</h1>
      
      {/* Mensajes de estado */}
      {message.state && (
        <div className={`${styles.message} ${
          message.message.includes('Error') ? styles.messageError : styles.messageSuccess
        }`}>
          {message.message}
        </div>
      )}

      {/* Filtros por tipo */}
      <div className={styles.filterSection}>
        <h3>Filtrar por Tipo</h3>
        <div className={styles.typeFilter}>
          <button
            className={`${styles.typeButton} ${userType === 'all' ? styles.typeButtonActive : ''}`}
            onClick={() => filterByType('all')}
          >
            Todos
          </button>
          <button
            className={`${styles.typeButton} ${userType === 'student' ? styles.typeButtonActive : ''}`}
            onClick={() => filterByType('student')}
          >
            Estudiantes
          </button>
          <button
            className={`${styles.typeButton} ${userType === 'teacher' ? styles.typeButtonActive : ''}`}
            onClick={() => filterByType('teacher')}
          >
            Profesores
          </button>
          <button
            className={`${styles.typeButton} ${userType === 'tutor' ? styles.typeButtonActive : ''}`}
            onClick={() => filterByType('tutor')}
          >
            Tutores
          </button>
        </div>
      </div>
        
      {/* Formulario para crear usuario */}
      <form onSubmit={createUser} className={styles.form}>
        <h2>Agregar Nuevo Usuario</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tipo de Usuario</label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value})}
              className={styles.input}
              required
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.pass}
              onChange={(e) => setFormData({...formData, pass: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>CURP</label>
            <input
              type="text"
              placeholder="CURP"
              value={formData.curp}
              onChange={(e) => setFormData({...formData, curp: e.target.value})}
              className={styles.input}
              required
              maxLength={18}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              value={formData.birth}
              onChange={(e) => setFormData({...formData, birth: e.target.value})}
              className={styles.input}
              required
            />
          </div>

          {/* Campos específicos por tipo */}
          {getTypeSpecificFields()}
        </div>
        
        <button 
          type="submit" 
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>

      {/* Búsqueda de usuarios */}
      <div className={styles.searchSection}>
        <h3>Buscar Usuarios</h3>
        <div className={styles.searchOptions}>
          <div className={styles.inputGroup}>
            <label>Buscar por</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className={styles.input}
            >
              <option value="name">Nombre</option>
              <option value="email">Email</option>
              <option value="kardex">Kardex</option>
              <option value="rfc">RFC</option>
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Término de búsqueda</label>
            <input
              type="text"
              placeholder={`Buscar por ${searchField}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchUsers();
                }
              }}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Acciones</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button"
                onClick={searchUsers}
                className={`${styles.button} ${styles.buttonSecondary}`}
                disabled={loading}
              >
                Buscar
              </button>
              <button 
                type="button"
                onClick={resetSearch}
                className={`${styles.button} ${styles.buttonOutline}`}
              >
                Mostrar Todos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>
            {userType === 'all' ? 'Todos los Usuarios' : 
             userType === 'student' ? 'Estudiantes' :
             userType === 'teacher' ? 'Profesores' : 'Tutores'}
          </h2>
          <span className={styles.countBadge}>{filteredUsers.length} usuarios</span>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Cargando usuarios...</div>
        ) : (
          <div className={styles.tableContainer}>
            {filteredUsers.length === 0 ? (
              <div className={styles.emptyState}>
                No hay usuarios registrados
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>CURP</th>
                    <th>Fecha Nac.</th>
                    <th>Información Extra</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: user.UserType === 'student' ? 'var(--green-100)' : 
                                    user.UserType === 'teacher' ? 'var(--blue-100)' : 'var(--purple-100)',
                          color: user.UserType === 'student' ? 'var(--green-800)' : 
                                user.UserType === 'teacher' ? 'var(--blue-800)' : 'var(--purple-800)'
                        }}>
                          {user.UserType === 'student' ? 'Estudiante' : 
                           user.UserType === 'teacher' ? 'Profesor' : 'Tutor'}
                        </span>
                      </td>
                      <td>{user.Name}</td>
                      <td>{user.Email}</td>
                      <td className={styles.curpCell}>{user.CURP}</td>
                      <td>{user.Birth ? new Date(user.Birth).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {user.UserType === 'student' && user.kardex && `Kardex: ${user.kardex}`}
                        {user.UserType === 'teacher' && user.RFC && `RFC: ${user.RFC}`}
                        {user.UserType === 'tutor' && user.Phone && `Tel: ${user.Phone}`}
                        {!user.kardex && !user.RFC && !user.Phone && 'N/A'}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
                            onClick={() => deleteUser(user._id)}
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