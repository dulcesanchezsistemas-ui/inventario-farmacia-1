import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Lotes from "./pages/Lotes";
import VentaProducto from "./pages/VentaProducto";
import Facturas from "./pages/Facturas";

import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  Bell,
  ChevronDown
} from "lucide-react";

function App() {
  const [vista, setVista] = useState("dashboard");

  const renderVista = () => {
    switch (vista) {
      case "productos":
        return <Productos setVista={setVista} />;

      case "lotes":
        return <Lotes setVista={setVista} />;

      case "ventas":
        return <VentaProducto setVista={setVista} />;

      case "facturas":
        return <Facturas setVista={setVista} />;

      default:
        return <Dashboard setVista={setVista} />;
    }
  };

  const menus = [
    {
      nombre: "Inicio",
      icono: <LayoutDashboard size={20} />,
      vista: "dashboard"
    },
    {
      nombre: "Productos",
      icono: <Package size={20} />,
      vista: "productos"
    },
    {
      nombre: "Lotes",
      icono: <Boxes size={20} />,
      vista: "lotes"
    },
    {
      nombre: "Ventas",
      icono: <ShoppingCart size={20} />,
      vista: "ventas"
    },
    {
      nombre: "Facturas",
      icono: <Receipt size={20} />,
      vista: "facturas"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">

      {/* SIDEBAR */}
      <aside
        className="
          w-[260px]
          bg-gradient-to-b
          from-[#081028]
          via-[#0b1739]
          to-[#111c44]
          text-white
          flex
          flex-col
          justify-between
          px-5
          py-6
          shadow-2xl
          relative
          overflow-hidden
        "
      >

        {/* GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full" />

        <div className="relative z-10">

          {/* LOGO */}
          <div className="mb-12">

            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-gradient-to-br
                from-violet-500
                to-blue-500
                flex
                items-center
                justify-center
                shadow-2xl
              "
            >
              <Package size={30} />
            </div>

            <h1 className="text-3xl font-bold mt-5 tracking-tight">
              FarmaSystem
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Smart Pharmacy Software
            </p>

          </div>

          {/* MENUS */}
          <div className="space-y-3">

            {menus.map((menu) => (
              <button
                key={menu.nombre}
                onClick={() => setVista(menu.vista)}
                className={`
                  w-full
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  transition-all
                  duration-300
                  text-left
                  group
                  ${
                    vista === menu.vista
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 shadow-xl"
                      : "hover:bg-white/5 text-slate-300"
                  }
                `}
              >

                <div
                  className={`
                    transition-all
                    ${
                      vista === menu.vista
                        ? "scale-110"
                        : "group-hover:scale-110"
                    }
                  `}
                >
                  {menu.icono}
                </div>

                <span className="font-medium">
                  {menu.nombre}
                </span>

              </button>
            ))}

          </div>

        </div>

        {/* STATUS */}
        <div
          className="
            relative
            z-10
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-5
            backdrop-blur-xl
          "
        >

          <div className="flex items-center gap-3">

            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

            <div>

              <p className="font-medium">
                Sistema operativo
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Todos los módulos activos
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 px-8 py-6 overflow-auto">

        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Bienvenido
            </h1>

            <p className="text-slate-400 mt-2">
              Resumen general del sistema farmacéutico.
            </p>

          </div>

          <div className="flex items-center gap-5">

            {/* NOTIFICATIONS */}
            <button
              className="
                relative
                w-12
                h-12
                rounded-2xl
                bg-white
                shadow-sm
                border
                border-gray-100
                flex
                items-center
                justify-center
                hover:shadow-lg
                transition-all
              "
            >

              <Bell size={20} className="text-slate-700" />

              <div
                className="
                  absolute
                  top-2
                  right-2
                  w-2
                  h-2
                  bg-violet-500
                  rounded-full
                "
              />

            </button>

            {/* USER */}
            <div
              className="
                bg-white
                border
                border-gray-100
                rounded-2xl
                px-5
                py-3
                flex
                items-center
                gap-4
                shadow-sm
                hover:shadow-lg
                transition-all
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gradient-to-br
                  from-violet-100
                  to-blue-100
                  text-violet-700
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                FS
              </div>

              <div>

                <p className="font-semibold text-slate-800">
                  FarmaSystem
                </p>

                <p className="text-sm text-slate-400">
                  Control administrativo
                </p>

              </div>

              <ChevronDown
                size={18}
                className="text-slate-400"
              />

            </div>

          </div>

        </div>

        {/* PAGE */}
        {renderVista()}

      </main>

    </div>
  );
}

export default App;