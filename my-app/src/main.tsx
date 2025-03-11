import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes"; // Importamos las rutas
import 'bootstrap-icons/font/bootstrap-icons.css';


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


//renderizacion de todas las rutas completas
root.render(
  <React.StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>
);
