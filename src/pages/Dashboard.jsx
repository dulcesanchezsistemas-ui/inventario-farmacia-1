import { useEffect, useState } from "react";

import {
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  Hourglass,
  Siren,
  TriangleAlert
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Dashboard({ setVista }) {

  const [productos, setProductos] =
    useState([]);

  const [lotes, setLotes] =
    useState([]);

  const [facturas, setFacturas] =
    useState([]);

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {

    cargarProductos();
    cargarLotes();
    cargarFacturas();

  }, []);

  // =========================
  // PRODUCTOS
  // =========================
  const cargarProductos = async () => {

    try {

      const res = await fetch(
        `${API_URL}/productos`
      );

      if (!res.ok) {
        throw new Error(
          "Error al cargar productos"
        );
      }

      const data = await res.json();

      setProductos(
        Array.isArray(data)
          ? data
          : data.productos || []
      );

    } catch (error) {

      console.error(error);

      setProductos([]);
    }
  };

  // =========================
  // LOTES
  // =========================
  const cargarLotes = async () => {

    try {

      const res = await fetch(
        `${API_URL}/lotes`
      );

      if (!res.ok) {
        throw new Error(
          "Error al cargar lotes"
        );
      }

      const data = await res.json();

      setLotes(
        Array.isArray(data)
          ? data
          : data.lotes || []
      );

    } catch (error) {

      console.error(error);

      setLotes([]);
    }
  };

  // =========================
  // FACTURAS
  // =========================
  const cargarFacturas = async () => {

    try {

      const res = await fetch(
        `${API_URL}/facturas`
      );

      if (!res.ok) {
        throw new Error(
          "Error al cargar facturas"
        );
      }

      const data = await res.json();

      setFacturas(
        Array.isArray(data)
          ? data
          : data.facturas || []
      );

    } catch (error) {

      console.error(error);

      setFacturas([]);
    }
  };

  // =========================
  // TARJETAS
  // =========================
  const tarjetas = [

    {
      titulo: "Productos",
      total: productos.length,
      icono: <Package size={28} />,
      color:
        "from-emerald-500 to-teal-500",
      vista: "productos"
    },

    {
      titulo: "Lotes",
      total: lotes.length,
      icono: <Boxes size={28} />,
      color:
        "from-sky-500 to-cyan-500",
      vista: "lotes"
    },

    {
      titulo: "Ventas",
      total: facturas.length,
      icono:
        <ShoppingCart size={28} />,
      color:
        "from-teal-500 to-emerald-500",
      vista: "ventas"
    },

    {
      titulo: "Facturas",
      total: facturas.length,
      icono:
        <Receipt size={28} />,
      color:
        "from-violet-500 to-purple-500",
      vista: "facturas"
    }
  ];

  return (

    <div className="space-y-8">

      {/* HEADER DASHBOARD */}
<div
  className="
   bg-[#ffffff]
    rounded-[32px]
    border
    border-[#e8eefc]
    p-8
    shadow-sm
  "
>

  <div className="
    flex
    flex-col
    xl:flex-row
    xl:items-center
    xl:justify-between
    gap-6
  ">

    {/* LEFT */}
    <div>

      <h1 className="
        text-4xl
font-bold
        text-slate-900
      ">
        ¡Bienvenido! 
      </h1>

      <p className="
        text-slate-500
        mt-3
        text-lg
      ">
        Aquí tienes el resumen general
        de tu farmacia.
      </p>

    </div>

    {/* RIGHT */}
    <div className="
      flex
      items-center
      gap-4
      flex-wrap
    ">

      <div
        className="
          bg-[#f7fafc]
          border
          border-[#e8eefc]
          rounded-3xl
          px-6
          py-4
          min-w-[180px]
        "
      >

        <p className="
          text-sm
          text-slate-400
        ">
          Fecha actual
        </p>

        <h3 className="
          text-lg
          font-bold
          text-slate-900
          mt-1
        ">
          {new Date().toLocaleDateString()}
        </h3>

      </div>

      <div
        className="
          bg-[#f7fafc]
          border
          border-[#e8eefc]
          rounded-3xl
          px-6
          py-4
          min-w-[180px]
        "
      >

        <p className="
          text-sm
          text-slate-400
        ">
          Hora actual
        </p>

        <h3 className="
          text-lg
          font-bold
          text-slate-900
          mt-1
        ">
          {new Date().toLocaleTimeString()}
        </h3>

      </div>

    </div>

  </div>

</div>
{/* ALERTAS DEL SISTEMA */}

<div
  className="
   bg-[#ffffff]
    rounded-[32px]
    border
   border-[#e8eefc]
    shadow-sm
    p-6
  "
>

  <div className="flex items-center justify-between mb-6">

    <div>

      <h2 className="text-2xl font-bold text-slate-900">
        Alertas del sistema
      </h2>

      <p className="text-slate-400 mt-2">
        Información importante del inventario.
      </p>

    </div>

    <div className="
      px-4
      py-2
      rounded-2xl
     bg-[#fffafa]
      text-red-600
      text-sm
      font-semibold
    ">
      {
        lotes.filter((l) => {
          if (!l.fechaVencimiento)
            return false;

          return (
            new Date(
              l.fechaVencimiento
            ) < new Date()
          );
        }).length
      } vencidos
    </div>

  </div>

  <div className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-6
  ">

    {/* PROXIMOS A VENCER */}
    <div className="
      rounded-[34px]
     bg-[#fffdf7]
      border
      border-yellow-100
      p-6
    ">

     <div
  className="
    w-20
    h-20
    rounded-[34px]
    bg-white
    border
    border-[#f8e7b5]
    flex
    items-center
    justify-center
    shadow-[0_10px_40px_rgba(15,23,42,0.04)]
  "
>
  <Hourglass
  size={42}
  className="text-yellow-500"
/>
</div>

      <h2 className="
        text-3xl
        font-black
        text-yellow-600
        mt-4
      ">
        {
          lotes.filter((l) => {

            if (!l.fechaVencimiento)
              return false;

            const hoy =
              new Date();

            const vencimiento =
              new Date(
                l.fechaVencimiento
              );

            const diferencia =
              (vencimiento - hoy) /
              (1000 * 60 * 60 * 24);

            return (
              diferencia > 0 &&
              diferencia <= 30
            );

          }).length
        }
      </h2>

      <p className="
        text-slate-500
        mt-3
        font-semibold tracking-tight
      ">
        Lotes próximos a vencer
      </p>

    </div>

    {/* VENCIDOS */}
    <div className="
      rounded-[34px]
     bg-[#fffafa]
      border
      border-red-100
      p-6
    ">

      <div
  className="
    w-20
    h-20
    rounded-[34px]
    bg-white
    border
    border-[#ffd9df]
    flex
    items-center
    justify-center
    shadow-[0_10px_40px_rgba(15,23,42,0.04)]
  "
>
  <Siren
  size={42}
  className="text-rose-500"
/>
</div>

      <h2 className="
        text-3xl
        font-black
        text-red-600
        mt-4
      ">
        {
          lotes.filter((l) => {

            if (!l.fechaVencimiento)
              return false;

            return (
              new Date(
                l.fechaVencimiento
              ) < new Date()
            );

          }).length
        }
      </h2>

      <p className="
        text-slate-500
        mt-3
        font-semibold tracking-tight
      ">
        Lotes vencidos
      </p>

    </div>

    {/* STOCK BAJO */}
    <div className="
      rounded-[34px]
     bg-[#fffaf5]
      border
      border-orange-100
      p-6
    ">
<div
  className="
    w-20
    h-20
    rounded-[34px]
    bg-white
    border
    border-[#ffe1bf]
    flex
    items-center
    justify-center
    shadow-[0_10px_40px_rgba(15,23,42,0.04)]
  "
>
  <TriangleAlert
  size={42}
  className="text-orange-500"
/>
</div>

      <h2 className="
        text-3xl
        font-black
        text-orange-500
        mt-4
      ">
        {
          lotes.filter(
            (l) =>
              Number(l.cantidad) <= 5
          ).length
        }
      </h2>

      <p className="
        text-slate-500
        mt-3
        font-semibold tracking-tight
      ">
        Stock bajo
      </p>

    </div>

  </div>

</div>
      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {tarjetas.map(
          (tarjeta) => (

            <button
              key={tarjeta.titulo}
              onClick={() =>
                setVista(
                  tarjeta.vista
                )
              }
              className="
               bg-[#ffffff]
                rounded-[24px]
                border
               border-[#e8eefc]
                shadow-sm
                p-6
                text-left
                hover:shadow-xl
                hover:-translate-y-1 hover:scale-[1.02] 
                transition-all
              "
            >

              <div
                className={`
                  w-16
                  h-16
                  rounded-3xl
                  bg-gradient-to-r
                  ${tarjeta.color}
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                `}
              >

                {tarjeta.icono}

              </div>

              <h2 className="text-slate-500 text-sm mt-6">
                {tarjeta.titulo}
              </h2>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {tarjeta.total}
              </p>

            </button>
          )
        )}

      </div>

      {/* GRID DASHBOARD */}
<div className="
  grid
  grid-cols-1
  xl:grid-cols-3
  gap-6
">

  {/* VENTAS */}
  <div
    className="
      xl:col-span-2
      bg-[#ffffff]
      rounded-[34px]
      border
      border-[#e8eefc]
      p-7
      shadow-sm
    "
  >

    <div className="
      flex
      items-center
      justify-between
      mb-8
    ">

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-slate-900
        ">
          Ventas últimos 7 días
        </h2>

        <p className="
          text-slate-400
          mt-2
        ">
          Resumen semanal
        </p>

      </div>

      <div
        className="
          px-4
          py-2
          rounded-2xl
          bg-emerald-50
          text-emerald-600
          text-sm
          font-semibold
        "
      >
        Últimos 7 días
      </div>

    </div>

    {/* BARRAS */}
    <div className="
      flex
      items-end
      justify-between
      gap-4
      h-[240px]
    ">

      {[35, 50, 60, 48, 72, 65, 55].map(
        (altura, index) => (

          <div
            key={index}
            className="
              flex
              flex-col
              items-center
              flex-1
            "
          >

            <div
              className="
                w-full
                rounded-t-3xl
                bg-gradient-to-t
                from-emerald-500
                to-cyan-400
              "
              style={{
                height: `${altura}%`
              }}
            />

            <p className="
              text-xs
              text-slate-400
              mt-3
            ">
              Día {index + 1}
            </p>

          </div>
        )
      )}

    </div>

  </div>

  {/* LOTES */}
  <div
    className="
      bg-[#ffffff]
      rounded-[34px]
      border
      border-[#e8eefc]
      p-7
      shadow-sm
    "
  >

    <div className="
      flex
      items-center
      justify-between
      mb-8
    ">

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-slate-900
        ">
          Próximos a vencer
        </h2>

        <p className="
          text-slate-400
          mt-2
        ">
          Lotes críticos
        </p>

      </div>

    </div>

    <div className="space-y-5">

      {lotes
        .slice(0, 4)
        .map((lote, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#eef2ff]
              pb-4
            "
          >

            <div>

              <h3 className="
                font-semibold
                text-slate-800
              ">
                {
                  lote.nombreProducto ||
                  lote.idProducto
                }
              </h3>

              <p className="
                text-sm
                text-slate-400
                mt-1
              ">
                Lote {lote.idLote}
              </p>

            </div>

            <div className="text-right">

              <p className="
                text-orange-500
                font-semibold
                text-sm
              ">
                Revisar
              </p>

            </div>

          </div>
        ))}

    </div>

  </div>

</div>

{/* ULTIMA FACTURA */}
<div
  className="
    bg-[#ffffff]
    rounded-[34px]
    border
    border-[#e8eefc]
    p-7
    shadow-sm
  "
>

  <div className="
    flex
    items-center
    justify-between
  ">

    <div>

      <p className="
        text-slate-400
        text-sm
      ">
        Última factura generada
      </p>

      <h2 className="
        text-2xl
        font-black
        text-slate-900
        mt-2
      ">
        {
          facturas.length > 0
            ? facturas[
                facturas.length - 1
              ].noFactura
            : "Sin facturas"
        }
      </h2>

    </div>

    <div>

      <p className="
        text-sm
        text-slate-400
      ">
        Total
      </p>

      <h2 className="
        text-3xl
        font-black
        text-emerald-600
        mt-2
      ">
        Q
        {
          facturas.length > 0
            ? Number(
                facturas[
                  facturas.length - 1
                ].totalPagar || 0
              ).toFixed(2)
            : "0.00"
        }
      </h2>

    </div>

  </div>

</div>

    </div>
  );
}

export default Dashboard;