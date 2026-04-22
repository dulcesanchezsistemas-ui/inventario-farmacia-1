import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Lotes from "./pages/Lotes";
import VentaProducto from "./pages/VentaProducto";

function App() {
  const [vista, setVista] = useState("dashboard");

  const menu = [
    { id: "dashboard", nombre: "Dashboard", icono: "📊" },
    { id: "productos", nombre: "Productos", icono: "💊" },
    { id: "lotes", nombre: "Lotes", icono: "📦" },
    { id: "ventas", nombre: "Venta de producto", icono: "🛒" }
  ];

  const obtenerTitulo = () => {
    switch (vista) {
      case "dashboard":
        return "Dashboard";
      case "productos":
        return "Productos";
      case "lotes":
        return "Lotes";
      case "ventas":
        return "Venta de producto";
      default:
        return "Sistema";
    }
  };

  const obtenerDescripcion = () => {
    switch (vista) {
      case "dashboard":
        return "Resumen general del sistema";
      case "productos":
        return "Gestión del catálogo de productos";
      case "lotes":
        return "Control de lotes y vencimientos";
      case "ventas":
        return "Registro de ventas por lote";
      default:
        return "Sistema de inventario";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-72 bg-gray-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">FarmaSystem</h1>
          <p className="text-sm text-gray-400 mt-1">
            Panel administrativo
          </p>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const activo = vista === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setVista(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left ${
                  activo
                    ? "bg-white text-gray-900 shadow-md font-semibold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icono}</span>
                <span>{item.nombre}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Estado del sistema</p>
            <h3 className="font-semibold mt-1">Operativo</h3>
            <p className="text-xs text-gray-500 mt-1">
              Módulos preparados para productos, lotes y ventas.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {obtenerTitulo()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {obtenerDescripcion()}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Sistema de inventario
          </div>
        </div>

        <div className="transition-all duration-300 animate-fadeIn">
          {vista === "dashboard" && <Dashboard />}
          {vista === "productos" && <Productos />}
          {vista === "lotes" && <Lotes />}
          {vista === "ventas" && <VentaProducto />}
        </div>
      </main>
    </div>
  );
}

export default App;