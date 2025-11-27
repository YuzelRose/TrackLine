"use client";
import { useState, useEffect } from 'react';
import styles from './css/user.module.css';
import { peticion } from '@/app/utils/Funtions';

export default function UserCrud() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [search, setSearch] = useState({ term: '', field: 'name' });
  const [form, setForm] = useState({
    name: '', email: '', pass: '', curp: '', birth: '', userType: 'profesor',
    kardex: '', relatedEmail: '', rfc: '', nCount: '', cedula: '', phone: ''
  });

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await peticion('crud/user/get-all', null, 'POST');
      
      if (response.status) {
        const usersData = response.data?.data || [];
        setUsers(Array.isArray(usersData) ? usersData : [usersData]);
        setMessage({ text: '', type: '' });
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error en fetchUsers:', error);
      setMessage({ text: 'Error al cargar usuarios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Datos a enviar:', form);
      
      const response = await peticion('crud/user/create', { data: form }, 'POST');
      
      console.log('Respuesta del servidor:', response);
      
      if (response.status) {
        setMessage({ text: response.message, type: 'success' });
        setForm({ 
          name: '', email: '', pass: '', curp: '', birth: '', userType: 'student',
          kardex: '', relatedEmail: '', rfc: '', nCount: '', cedula: '', phone: '' 
        });
        fetchUsers();
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error en createUser:', error);
      setMessage({ text: 'Error al crear usuario', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    setLoading(true);
    try {
      const response = await peticion('crud/user/drop', { id }, 'POST');
      
      if (response.status) {
        setMessage({ text: response.message, type: 'success' });
        fetchUsers();
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error en deleteUser:', error);
      setMessage({ text: 'Error al eliminar usuario', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuarios - CORREGIDO
  const searchUsers = async () => {
    if (!search.term.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    try {
      const searchData = { 
        [search.field === 'name' ? 'Name' : 'Email']: search.term
      };

      const response = await peticion('crud/user/find-by', { data: searchData }, 'POST');
      
      console.log('Respuesta búsqueda:', response); // DEBUG
      
      if (response.status) {
        let usersData = response.data?.data || [];
        
        // Asegurar que siempre sea un array
        if (!Array.isArray(usersData)) {
          usersData = [usersData]; // Convertir objeto único a array
        }
        
        setUsers(usersData);
        setMessage({ 
          text: usersData.length ? 'Usuario(s) encontrado(s)' : 'No se encontraron usuarios', 
          type: usersData.length ? 'success' : 'info' 
        });
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error en searchUsers:', error);
      setMessage({ text: 'Error al buscar usuarios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const searchFields = [
    { value: 'name', label: 'Nombre' },
    { value: 'email', label: 'Email' }
  ];

  // Asegurar que users siempre sea un array
  const safeUsers = Array.isArray(users) ? users : [];

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  return (
    <div className={styles.container}>
      {/* Mensaje */}
      {message.text && (
        <div className={`${styles.message} ${styles[`message${message.type}`]}`}>
          {message.text}
        </div>
      )}
      {/* Crear profesor */}
      <form onSubmit={createUser} className={styles.form}>
        <h2>Crear profesor</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={form.pass}
              onChange={(e) => setForm(prev => ({ ...prev, pass: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>CURP</label>
            <input
              type="text"
              placeholder="CURP"
              value={form.curp}
              onChange={(e) => setForm(prev => ({ ...prev, curp: e.target.value }))}
              className={styles.input}
              required
              maxLength={18}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              value={form.birth}
              onChange={(e) => setForm(prev => ({ ...prev, birth: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>RFC</label>
            <input
              type="text"
              placeholder="RFC"
              value={form.rfc}
              onChange={(e) => setForm(prev => ({ ...prev, rfc: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Número de Cuenta</label>
            <input
              type="text"
              placeholder="Número de Cuenta"
              value={form.nCount}
              onChange={(e) => setForm(prev => ({ ...prev, nCount: e.target.value }))}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Cédula</label>
            <input
              type="text"
              placeholder="Cédula"
              value={form.cedula}
              onChange={(e) => setForm(prev => ({ ...prev, cedula: e.target.value }))}
              className={styles.input}
            />
          </div>
          {/* Campos específicos para TUTOR */}
          {form.userType === 'tutor' && (
            <div className={styles.inputGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className={styles.input}
              />
            </div>
          )}
        </div>
        
        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={loading}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>

      {/* Búsqueda */}
      <div className={styles.searchSection}>
        <h3>Buscar Usuarios</h3>
        <div className={styles.searchOptions}>
          <div className={styles.inputGroup}>
            <label>Buscar por</label>
            <select
              value={search.field}
              onChange={(e) => setSearch(prev => ({ ...prev, field: e.target.value }))}
              className={styles.input}
            >
              {searchFields.map(field => (
                <option key={field.value} value={field.value}>{field.label}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Término de búsqueda</label>
            <input
              type="text"
              placeholder={`Buscar por ${search.field}`}
              value={search.term}
              onChange={(e) => setSearch(prev => ({ ...prev, term: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Acciones</label>
            <div className={styles.searchActions}>
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
                onClick={() => {
                  setSearch({ term: '', field: 'name' });
                  fetchUsers();
                }} 
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
          <h2>Lista de Usuarios</h2>
          <span className={styles.countBadge}>
            {safeUsers.length} usuarios
          </span>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Cargando usuarios...</div>
        ) : safeUsers.length === 0 ? (
          <div className={styles.emptyState}>No hay usuarios registrados</div>
        ) : (
          <div className={styles.tableContainer}>
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
                {safeUsers.map(user => {
                  const extraInfo = 
                    user.UserType === 'student' && user.kardex ? `Kardex: ${user.kardex}` :
                    user.UserType === 'profesor' && user.RFC ? `RFC: ${user.RFC}` :
                    user.UserType === 'tutor' && user.Phone ? `Tel: ${user.Phone}` : 'N/A';

                  return (
                    <tr key={user._id}>
                      <td>
                        <span className={`${styles.typeBadge} ${styles[user.UserType]}`}>
                          {user.UserType === 'student' ? 'Estudiante' : 
                           user.UserType === 'profesor' ? 'Profesor' : 'Tutor'}
                        </span>
                      </td>
                      <td>{user.Name}</td>
                      <td>{user.Email}</td>
                      <td className={styles.curpCell}>{user.CURP}</td>
                      <td>{user.Birth ? new Date(user.Birth).toLocaleDateString() : 'N/A'}</td>
                      <td>{extraInfo}</td>
                      <td>
                        <button 
                          className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
                          onClick={() => deleteUser(user._id)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}