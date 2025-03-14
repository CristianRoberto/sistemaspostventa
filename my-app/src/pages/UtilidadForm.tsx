import React, { useState } from 'react';
import axios from 'axios';

const UtilidadForm = () => {
  // Establecer el estado para las fechas y los resultados
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [utilidad, setUtilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manejar el cambio en los campos de fecha
  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Enviar los datos al backend para calcular la utilidad
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las fechas estén presentes
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, ingrese ambas fechas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Llamar al backend con las fechas de inicio y fin
      const response = await axios.post('http://localhost:5000/utilidad', {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      // Establecer los resultados obtenidos
      setUtilidad(response.data);
    } catch (error) {
      console.error(error);
      setError('Error al obtener los datos de utilidad.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cálculo de Utilidad Diaria</h2>
      
      {/* Formulario de entrada de fechas */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha de inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={handleFechaInicioChange}
          />
        </div>
        <div>
          <label>Fecha de fin:</label>
          <input
            type="date"
            value={fechaFin}
            onChange={handleFechaFinChange}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {/* Mostrar los resultados si existen */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {utilidad && (
        <div>
          <h3>Resultados</h3>
          <p><strong>Ventas:</strong> {utilidad.ventas}</p>
          <p><strong>Devoluciones:</strong> {utilidad.devoluciones}</p>
          <p><strong>Compras:</strong> {utilidad.compras}</p>
          <p><strong>Utilidad Bruta:</strong> {utilidad.utilidad_bruta}</p>
          <p><strong>Pagos Adicionales:</strong> {utilidad.pagos_adicionales}</p>
          <p><strong>Utilidad Diaria:</strong> {utilidad.utilidad_diaria}</p>
        </div>
      )}
    </div>
  );
};

export default UtilidadForm;
