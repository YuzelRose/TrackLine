"use client";
import { useState, useEffect } from 'react';
import styles from './css/tabloids-page.module.css';
import { peticion } from '@/app/utils/Funtions';

export default function TabloidCrud() {
  const [tabloids, setTabloids] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [form, setForm] = useState({ Name: '', Owner: '', description: '', amaunt: 0 });

  // Cargar datos - CON MÁS DEBUG
  const loadData = async () => {
    setLoading(true);
    try {
      const [tabloidsRes, professorsRes] = await Promise.all([
        peticion('crud/tabloid/get-all', null, 'POST'),
        peticion('crud/tabloid/professors', null, 'GET')
      ]);
      // Asegurar que tabloids sea un array
      if (tabloidsRes.status) {
        const tabloidsData = tabloidsRes.data?.data || [];
        setTabloids(Array.isArray(tabloidsData) ? tabloidsData : [tabloidsData]);
      } else {
        console.error('Error en tabloides:', tabloidsRes.message);
      }

      // Asegurar que professors sea un array
      if (professorsRes.status) {
        const professorsData = professorsRes.data?.data || [];
        setProfessors(Array.isArray(professorsData) ? professorsData : [professorsData]);
      } else {
        console.error('Error en profesores:', professorsRes.message);
      }
      
      if (!tabloidsRes.status) setMessage({ text: tabloidsRes.message, type: 'error' });
      if (!professorsRes.status) setMessage({ text: professorsRes.message, type: 'error' });
    } catch (error) {
      console.error('Error en loadData:', error);
      setMessage({ text: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
      console.log('✅ Carga de datos completada');
    }
  };

  // Crear tabloide - CON MÁS DEBUG
  const createTabloid = async (e) => {
    e.preventDefault();
    if (!form.Name || !form.Owner || !form.description) {
      const errorMsg = 'Todos los campos son requeridos';
      console.error('Validación fallida:', errorMsg);
      setMessage({ text: errorMsg, type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await peticion('crud/tabloid/create', { data: form }, 'POST');
      if (response.status) {
        const successMsg = response.message || 'Tabloide creado exitosamente';
        setMessage({ text: successMsg, type: 'success' });
        setForm({ Name: '', Owner: '', description: '' });
        loadData();
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error en createTabloid:', error);
      setMessage({ text: 'Error al crear tabloide: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tabloide
  const deleteTabloid = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este tabloide?')) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🗑️ Eliminando tabloide:', id);
      const response = await peticion('crud/tabloid/drop', { id }, 'POST');
      
      if (response.status) {
        console.log('✅ Tabloide eliminado:', response.message);
        setMessage({ text: response.message, type: 'success' });
        loadData();
      } else {
        console.error('❌ Error al eliminar:', response.message);
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      console.error('💥 Error en deleteTabloid:', error);
      setMessage({ text: 'Error al eliminar tabloide', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    console.log('🎬 Componente montado, cargando datos...');
    loadData(); 
  }, []);

  // Variables seguras que siempre son arrays
  const safeTabloids = Array.isArray(tabloids) ? tabloids : [];
  const safeProfessors = Array.isArray(professors) ? professors : [];

  console.log('📊 Estado actual:', {
    loading,
    safeTabloidsCount: safeTabloids.length,
    safeProfessorsCount: safeProfessors.length,
    form
  });

  return (
    <div className={styles.container}>
      {message.text && (
        <div className={`${styles.message} ${styles[`message${message.type}`]}`}>
          {message.text}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={createTabloid} className={styles.form}>
        <h2>Agregar Nuevo Tabloide</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Nombre del Tabloide</label>
            <input
              type="text"
              placeholder="Nombre del tabloide"
              value={form.Name}
              onChange={(e) => setForm(prev => ({ ...prev, Name: e.target.value }))}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Profesor Responsable</label>
            <select
              value={form.Owner}
              onChange={(e) => setForm(prev => ({ ...prev, Owner: e.target.value }))}
              className={styles.input}
              required
              disabled={loading}
            >
              <option value="">{loading ? 'Cargando...' : 'Selecciona un profesor'}</option>
              {safeProfessors.map(professor => (
                <option key={professor._id} value={professor._id}>
                  {professor.Name} - {professor.Email} ({professor.RFC})
                </option>
              ))}
            </select>
            <div className={styles.helperText}>
              {safeProfessors.length} profesores disponibles
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Costo:</label>
            <input
                type="number"
                placeholder="Costo default: $0"
                value={form.amaunt ?? 0}  // ← Nullish coalescing
                onChange={(e) => {
                    const value = e.target.value;
                    setForm(prev => ({ 
                        ...prev, 
                        amaunt: value === '' ? 0 : Number(value) 
                    }));
                }}
                min="0"
                step="0.01"
                className={styles.input}
            />
            {form.amaunt > 0 && (
                <div className={styles.helperText}>
                    ${form.amaunt.toFixed(2)}
                </div>
            )}
        </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Descripción</label>
            <textarea
              placeholder="Descripción del tabloide"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className={styles.textarea}
              required
              rows="4"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={loading || safeProfessors.length === 0}
        >
          {loading ? 'Creando...' : 'Crear Tabloide'}
        </button>
        
        {safeProfessors.length === 0 && !loading && (
          <div className={styles.warningText}>
            No hay profesores disponibles. Registre profesores primero.
          </div>
        )}
      </form>

      {/* Lista */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2>Lista de Tabloides</h2>
          <span className={styles.countBadge}>{safeTabloids.length} tabloides</span>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : safeTabloids.length === 0 ? (
          <div className={styles.emptyState}>No hay tabloides registrados</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Profesor</th>
                  <th>Email</th>
                  <th>RFC</th>
                  <th>Descripción</th>
                  <th>Tareas</th>
                  <th>Pagos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {safeTabloids.map(tabloid => (
                  <tr key={tabloid._id}>
                    <td>{tabloid.Name}</td>
                    <td>{tabloid.Owner?.Name || 'N/A'}</td>
                    <td>{tabloid.Owner?.Email || 'N/A'}</td>
                    <td>{tabloid.Owner?.RFC || 'N/A'}</td>
                    <td className={styles.descriptionCell}>
                      {tabloid.description?.length > 50 
                        ? `${tabloid.description.substring(0, 50)}...` 
                        : tabloid.description || 'Sin descripción'}
                    </td>
                    <td><span className={styles.badge}>{tabloid.homeworkCount || 0}</span></td>
                    <td><span className={styles.badge}>{tabloid.paymentCount || 0}</span></td>
                    <td>
                      <button 
                        className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
                        onClick={() => deleteTabloid(tabloid._id)}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}