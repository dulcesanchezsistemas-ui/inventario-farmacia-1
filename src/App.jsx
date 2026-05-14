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
        return "Facturas";
      default:
        return "Dashboard";
    }
  };

  const volverDashboard = () => {
    setVista("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {vista !== "dashboard" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {obtenerTitulo()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sistema de inventario farmacéutico
            </p>
          </div>

          <button
            onClick={volverDashboard}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition-all"
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