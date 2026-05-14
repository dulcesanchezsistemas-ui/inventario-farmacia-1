import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Lotes from "./pages/Lotes";
import VentaProducto from "./pages/VentaProducto";
import Facturas from "./pages/Facturas";

function App() {
  const [vista, setVista] = useState("dashboard");

  const obtenerTitulo = () => {
    switch (vista) {
      case "productos":
        return "Productos";

      case "lotes":
        return "Lotes";

      case "ventas":
        return "Ventas";

      case "facturas":
        return "Facturación";

      default:
        return "Dashboard";
    }
  };

  const obtenerDescripcion = () => {
    switch (vista) {
      case "productos":
        return "Gestión del catálogo de productos";

      case "lotes":
        return "Control de lotes y vencimientos";

      case "ventas":
        return "Punto de venta del sistema";

      case "facturas":
        return "Módulo de facturación";

      default:
        return "Resumen general del sistema";
    }
  };

  const volverDashboard = () => {
    setVista("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {vista !== "dashboard" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-5 mb-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {obtenerTitulo()}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {obtenerDescripcion()}
            </p>
          </div>

          <button
            onClick={volverDashboard}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl transition-all shadow-sm"
          >
            Volver al Dashboard
          </button>
        </div>
      )}

      <div className="transition-all duration-300 animate-fadeIn">
        {vista === "dashboard" && <Dashboard setVista={setVista} />}

        {vista === "productos" && <Productos />}

        {vista === "lotes" && <Lotes />}

        {vista === "ventas" && <VentaProducto />}

        {vista === "facturas" && <Facturas />}
      </div>
    </div>
  );
}

export default App;