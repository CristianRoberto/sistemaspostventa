import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/DetalleVenta.css";

// Definir las interfaces para los datos
interface Cliente {
  cliente_id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  estado: string;
  tipo_cliente: string;
  ruc_cedula: string;
  metodo_contacto_preferido: string;
  ultima_compra: string;
  total_compras: string;
  observaciones: string;
  nivel_satisfaccion: number;
  cantidad_reclamos: number;
}

interface Empleado {
  empleado_id: number;
  cedula: string | null;
  nombre: string;
  direccion: string | null;
  puesto: string;
  telefono: string;
  email: string;
  salario: string | null;
  imagenempleado: string | null;
}

interface DetalleVenta {
  producto_id: number;
  nombre: string;
  descripcion: string;
  imagenproducto: string;
  precio: string; // Usamos string porque en la API puede venir como texto
  cantidad: number;
  subtotal: number;
  descuento: number;
  impuestos: number;
}

interface Venta {
  venta_id: number;
  total_neto: number;
  total: string;
  descuento: string;
  impuestos: string;
  metodo_pago: string;
  estado: string;
  fecha: string;
  cliente: Cliente; // Relación con el cliente
  empleado: Empleado; // Relación con el empleado
  detalles: DetalleVenta[]; // Detalles de los productos de la venta
}

const DetallesVenta = () => {
  const { id } = useParams(); // Obtienes el id de la venta
  const [venta, setVenta] = useState<Venta | null>(null); // Tipo de estado con el tipo Venta
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  useEffect(() => {
    // Función para obtener los detalles de la venta
    const fetchVentaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ventas/${id}`); // Usa la URL de tu API
        console.log('Datos de la venta:', response.data);  // Verificar la respuesta completa
        setVenta(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVentaDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Cargando detalles de la venta...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!venta) return <p className="text-center text-gray-600">No se encontraron detalles de la venta.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 border border-gray-200 cardetalleventa">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Detalles de la Venta {venta.venta_id}</h1>
      
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div className="bg-gray-50 p-4 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Información de la Venta</h2>
          <p><strong>Total Neto:</strong> ${venta.total_neto}</p>
          <p><strong>Total:</strong> ${venta.total}</p>
          <p><strong>Descuento:</strong> ${venta.descuento}</p>
          <p><strong>Impuestos:</strong> ${venta.impuestos}</p>
          <p><strong>Método de Pago:</strong> {venta.metodo_pago}</p>
          <p><strong>Estado:</strong> {venta.estado}</p>
          <p><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Cliente</h2>
          <p><strong>Nombre:</strong> {venta.cliente?.nombre}</p>
          <p><strong>Email:</strong> {venta.cliente?.email}</p>
          <p><strong>Teléfono:</strong> {venta.cliente?.telefono}</p>
          <p><strong>Dirección:</strong> {venta.cliente?.direccion}</p>
          <p><strong>Estado:</strong> {venta.cliente?.estado}</p>
          <p><strong>Tipo Cliente:</strong> {venta.cliente?.tipo_cliente}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-md border mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Empleado</h2>
        <p><strong>Nombre:</strong> {venta.empleado?.nombre}</p>
        <p><strong>Puesto:</strong> {venta.empleado?.puesto}</p>
        <p><strong>Email:</strong> {venta.empleado?.email}</p>
        <p><strong>Teléfono:</strong> {venta.empleado?.telefono}</p>
      </div>

      {/* Mostrar los productos de la venta */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-md border mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Productos</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Precio Unitario</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles?.map((detalle, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{detalle.nombre}</td> {/* Nombre del producto */}
                <td className="px-4 py-2">{detalle.cantidad}</td>
                <td className="px-4 py-2">${detalle.precio}</td> {/* Precio unitario */}
                <td className="px-4 py-2">${detalle.subtotal}</td> {/* Total */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetallesVenta;
