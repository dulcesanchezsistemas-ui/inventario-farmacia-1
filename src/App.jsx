import { useEffect, useState } from "react";

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

  const [mostrarNotificaciones, setMostrarNotificaciones] =
    useState(false);

  const [notificaciones, setNotificaciones] =
    useState([]);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/lotes"
      );

      const data = await res.json();

      const hoy = new Date();

      const nuevas = [];

      data.forEach((lote) => {
        const vencimiento =
          new Date(
            lote.fechaVencimiento
          );

        const diff =
          (vencimiento - hoy) /
          (1000 * 60 * 60 * 24);

        // VENCIDOS
        if (diff < 0) {
          nuevas.push({
            tipo: "vencido",
           mensaje: `Lote ${
  lote.codigoLote ||
  lote.idLote ||
  "Sin código"
} vencido`
          });
        }

        // POR VENCER
        else if (diff <= 30) {
          nuevas.push({
            tipo: "porVencer",
            mensaje: `Lote ${
  lote.codigoLote ||
  lote.idLote ||
  "Sin código"
} por vencer`
          });
        }

        // STOCK BAJO
        if (
          Number(lote.cantidad) <= 10
        ) {
          nuevas.push({
            tipo: "stock",
            mensaje: `Stock bajo en ${
  lote.nombreProducto ||
  lote.nombre ||
  "producto"
}`
          });
        }
      });

      setNotificaciones(nuevas);
    } catch (error) {
      console.error(error);
    }
  };

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
              DrogueriaRogil
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
                onClick={() =>
                  setVista(menu.vista)
                }
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
              Bienvenido 👋
            </h1>

            <p className="text-slate-400 mt-2">
              Resumen general del sistema farmacéutico.
            </p>

          </div>

          <div className="flex items-center gap-5 relative">

            {/* NOTIFICATIONS */}
            <button
              onClick={() =>
                setMostrarNotificaciones(
                  !mostrarNotificaciones
                )
              }
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

              <Bell
                size={20}
                className="text-slate-700"
              />

              {notificaciones.length >
                0 && (
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
              )}

            </button>

            {/* DROPDOWN */}
            {mostrarNotificaciones && (
              <div
                className="
                  absolute
                  top-16
                  right-0
                  w-[340px]
                  bg-white
                  rounded-3xl
                  shadow-2xl
                  border
                  border-gray-100
                  p-5
                  z-50
                "
              >

                <h3 className="text-xl font-bold text-slate-900 mb-5">
                  Notificaciones
                </h3>

                {notificaciones.length ===
                0 ? (
                  <p className="text-slate-400">
                    No hay alertas
                  </p>
                ) : (
                  <div className="space-y-3">

                    {notificaciones.map(
                      (
                        noti,
                        index
                      ) => (
                        <div
                          key={index}
                          className="
                            bg-slate-50
                            rounded-2xl
                            p-4
                            border
                            border-gray-100
                          "
                        >

                          <p className="text-sm text-slate-700">
                            {
                              noti.mensaje
                            }
                          </p>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

            

          </div>

        </div>

        {/* PAGE */}
        {renderVista()}

      </main>

    </div>
  );
}

export default App;