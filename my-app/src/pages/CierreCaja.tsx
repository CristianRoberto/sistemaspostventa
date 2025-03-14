import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';

// Definimos las interfaces de los tipos
interface Empleado {
  empleado_id: any;
  nombre: any;
}

interface CierreCaja {
  id: any;
  fecha_apertura: Date;
  fecha_cierre: Date;
  
  monto_inicial: any;
  total_ventas: any;
  efectivo_final: any;
  tarjeta_final: any;
  diferencia: string;
  empleado_id: any;
  estado: any;
  total_cierrecaja_efectivo: any;
  empleado?: Empleado;
}

const CierreCaja = () => {
  const [cierresCaja, setCierresCaja] = useState<CierreCaja[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]); // Estado para los empleados
  const [busqueda, setBusqueda] = useState("");
  const [criterio, setCriterio] = useState<string>("id"); // Now criterio is a string to handle custom keys like "empleado_nombre"
  const [pagina, setPagina] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [cajaSeleccionada, setCajaSeleccionada] = useState<CierreCaja | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    efectivo_final: "",
    tarjeta_final: "",
  });

  const cierresPorPagina = 5;

  useEffect(() => {
    fetchCierresCaja();
    fetchEmpleados(); // Cargar empleados
  }, []);

  const fetchCierresCaja = async () => {
    try {
      const response = await axios.get<CierreCaja[]>("http://localhost:5000/aperturacaja/");
      setCierresCaja(response.data);
    } catch (error) {
      console.error("Error al obtener los cierres de caja", error);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get<Empleado[]>("http://localhost:5000/empleado");
      setEmpleados(response.data); // Cargar los empleados
    } catch (error) {
      console.error("Error al obtener los empleados", error);
    }
  };

 
  const cierresFiltrados = cierresCaja.filter((cierre) => {
    if (!busqueda) return true;
  
    // Custom filtering logic for "Empleado Nombre"
    if (criterio === "empleado_nombre") {
      return cierre.empleado?.nombre.toLowerCase().includes(busqueda.toLowerCase());
    }
  
    // Custom filtering logic for "Fecha_Apertura" and "Fecha_Cierre"
    if (criterio === "fecha_apertura" || criterio === "fecha_cierre") {
      // Convert the date field (either fecha_apertura or fecha_cierre) to string
      const fecha = criterio === "fecha_apertura" ? cierre.fecha_apertura : cierre.fecha_cierre;
      
      // Format the date to a readable string (e.g., "dd/MM/yyyy")
      const formattedFecha = fecha ? format(new Date(fecha), "dd/MM/yyyy") : "";
  
      // Compare the formatted date with the search query
      return formattedFecha.includes(busqueda);
    }
  
    // Otherwise, use the regular criteria for other fields
    return String(cierre[criterio as keyof CierreCaja]).toLowerCase().includes(busqueda.toLowerCase());
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/cerrarcaja/", {
        id: formData.id,
        efectivo_final: formData.efectivo_final,
        tarjeta_final: formData.tarjeta_final,
      });

      console.log("Caja cerrada con éxito:", response.data);

      fetchCierresCaja();
      setOpenModal(false);
    } catch (error) {
      console.error("Error al cerrar la caja:", error);
    }
  };

  const handleOpenModal = (cierre: CierreCaja) => {
    setCajaSeleccionada(cierre);
    setFormData({
      id: cierre.id.toString(),
      efectivo_final: "",
      tarjeta_final: "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Historial de Cierre de Caja
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Buscar por"
            value={criterio}
            onChange={(e) => {
              setCriterio(e.target.value);
              setBusqueda("");
              setPagina(1);
            }}
            variant="outlined"
          >
            <MenuItem value="id">Numero_Caja</MenuItem>
            <MenuItem value="fecha_apertura">Fecha_Apertura</MenuItem>
            <MenuItem value="fecha_cierre">Fecha_Cierre ID</MenuItem>
            <MenuItem value="estado">Estado</MenuItem>
            <MenuItem value="empleado_nombre">Empleado Nombre</MenuItem> {/* Added this menu item */}
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Buscar"
            variant="outlined"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow className="headertabla">
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Apertura</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha_Cierre</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Empleado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Monto_Inicial</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_Vendido</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Efectivo_Final_en_Caja</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tarjetas_Final_en_Caja</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total_en_caja</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Diferencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cierresFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} style={{ textAlign: "center", padding: "20px" }}>
                  <Typography variant="h6" color="error">
                    No hay registros disponibles.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cierresFiltrados
                .slice((pagina - 1) * cierresPorPagina, pagina * cierresPorPagina)
                .map((cierre) => (
                  <TableRow key={cierre.id}>
                    <TableCell>{cierre.id}</TableCell>
                    <TableCell>
                      <IconButton
                        style={{
                          backgroundColor: cierre.estado === "abierto" ? '#4CAF50' : '#F44336',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => handleOpenModal(cierre)}
                        disabled={cierre.estado !== "abierto"}
                      >
                        {cierre.estado === "abierto" ? "Cerrar Caja" : "Caja Cerrada"}
                      </IconButton>
                    </TableCell>
                    <TableCell>{format(new Date(cierre.fecha_apertura), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                    <TableCell>
                      {cierre?.estado === "cerrado" && cierre?.fecha_cierre
                        ? format(toZonedTime(new Date(cierre.fecha_cierre), 'America/Guayaquil'), "dd/MM/yyyy HH:mm:ss")
                        : "No disponible"}
                    </TableCell>
                    <TableCell>{cierre.estado}</TableCell>
                    <TableCell>{cierre.empleado?.nombre || "Sin asignar Nombre"}</TableCell>
                    <TableCell>{cierre.monto_inicial}</TableCell>
                    <TableCell>{cierre.total_ventas}</TableCell>
                    <TableCell>{cierre.efectivo_final}</TableCell>
                    <TableCell>{cierre.tarjeta_final}</TableCell>
                    <TableCell>{cierre.total_cierrecaja_efectivo}</TableCell>
                    <TableCell>{cierre.diferencia}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(cierresFiltrados.length / cierresPorPagina)}
        page={pagina}
        onChange={(_event, value) => setPagina(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ background: 'yellow', fontWeight: '600', textAlign: 'center' }}>CERRAR CAJA</DialogTitle>
        
        <br></br>
        <DialogContent>
          <TextField
            fullWidth
            label="Numero de Caja"
            name="id"
            value={formData.id}
            type="number"
            disabled
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Total en Efectivo Caja"
            name="efectivo_final"
            value={formData.efectivo_final}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            label="Total en Tarjetas Caja"
            name="tarjeta_final"
            value={formData.tarjeta_final}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary" variant="contained">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Cerrar Caja. Ahora.</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CierreCaja;
