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
    <div className="min-h-screen bg-[#f8fafc]">

      

      {/* CONTENT */}
      <main className="px-8 py-6 max-w-[1700px] mx-auto">

        {/* TOPBAR */}
<div className="flex items-center justify-between mb-10">

  {/* LOGO + MENU */}
  <div className="flex items-center gap-5">

    <div
      className="
        w-16
        h-16
        rounded-3xl
        bg-gradient-to-br
       from-emerald-500
to-teal-500
        flex
        items-center
        justify-center
        shadow-xl
      "
    >
      <Package size={30} className="text-white" />
    </div>

    <div>

      <h1 className="text-4xl font-black text-slate-900">
        DrogueriaRogil
      </h1>

      <p className="text-slate-400 mt-1">
        Sistema administrativo farmacéutico
      </p>

    </div>

  </div>

  {/* MENU HORIZONTAL */}
  <div className="flex items-center gap-3">

    {menus.map((menu) => (
      <button
        key={menu.nombre}
        onClick={() =>
          setVista(menu.vista)
        }
        className={`
          flex
          items-center
          gap-3
          px-5
          h-12
          rounded-xl
          transition-all
          font-medium
          ${
            vista === menu.vista
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
              : "bg-white border border-gray-100 text-slate-600 hover:shadow-md"
          }
        `}
      >

        {menu.icono}

        {menu.nombre}

      </button>
    ))}

  </div>

  {/* NOTIFICACIONES */}
  <div className="relative">

    <button
      onClick={() =>
        setMostrarNotificaciones(
          !mostrarNotificaciones
        )
      }
      className="
        relative
        w-14
        h-12
        rounded-xl
        bg-white
        border
        border-gray-100
        shadow-sm
        flex
        items-center
        justify-center
        hover:shadow-lg
        transition-all
      "
    >

      <Bell
        size={22}
        className="text-slate-700"
      />

      {notificaciones.length > 0 && (
        <div
          className="
            absolute
            top-2
            right-2
            w-3
            h-3
            bg-red-500
            rounded-full
          "
        />
      )}

    </button>

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

        {notificaciones.length === 0 ? (

          <p className="text-slate-400">
            No hay alertas
          </p>

        ) : (

          <div className="space-y-3">

            {notificaciones.map(
              (noti, index) => (

                <div
                  key={index}
                  className="
                    bg-slate-50
                    rounded-xl
                    p-4
                    border
                    border-gray-100
                  "
                >

                  <p className="text-sm text-slate-700">
                    {noti.mensaje}
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