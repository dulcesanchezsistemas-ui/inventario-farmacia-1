import { useEffect, useState } from "react";

import {
  Package,
  Boxes,
  ShoppingCart,
  Receipt
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
        "from-violet-600 to-purple-600",
      vista: "productos"
    },

    {
      titulo: "Lotes",
      total: lotes.length,
      icono: <Boxes size={28} />,
      color:
        "from-blue-600 to-cyan-600",
      vista: "lotes"
    },

    {
      titulo: "Ventas",
      total: facturas.length,
      icono:
        <ShoppingCart size={28} />,
      color:
        "from-emerald-600 to-green-600",
      vista: "ventas"
    },

    {
      titulo: "Facturas",
      total: facturas.length,
      icono:
        <Receipt size={28} />,
      color:
        "from-orange-500 to-amber-500",
      vista: "facturas"
    }
  ];

  return (

    <div className="space-y-8">

      {/* HERO */}
      <div
        className="
          bg-gradient-to-r
          from-[#081028]
          to-[#132b63]
          rounded-[36px]
          p-10
          text-white
          shadow-2xl
          relative
          overflow-hidden
        "
      >

        <div className="relative z-10">

          <h1 className="text-5xl font-bold leading-tight">
            Bienvenido a
            <br />
            DrogueriaRogil
          </h1>

          <p className="text-white/70 mt-5 text-lg max-w-2xl">
            Sistema administrativo farmacéutico
            para el control de inventario,
            ventas, lotes y facturación.
          </p>

        </div>

        {/* DECORACION */}
        <div
          className="
            absolute
            w-96
            h-96
            rounded-full
            bg-violet-500/20
            -top-20
            -right-20
            blur-3xl
          "
        />

      </div>
{/* ALERTAS DEL SISTEMA */}

<div
  className="
    bg-white
    rounded-[32px]
    border
    border-gray-100
    shadow-sm
    p-7
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
      bg-red-50
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
      rounded-[28px]
      bg-yellow-50
      border
      border-yellow-100
      p-6
    ">

      <div
  className="
    w-16
    h-16
    rounded-3xl
    bg-gradient-to-r
    from-yellow-400
    to-orange-400
    flex
    items-center
    justify-center
    text-white
    text-2xl
    shadow-lg
  "
>
  ⏳
</div>

      <h2 className="
        text-4xl
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
        font-medium
      ">
        Lotes próximos a vencer
      </p>

    </div>

    {/* VENCIDOS */}
    <div className="
      rounded-[28px]
      bg-red-50
      border
      border-red-100
      p-6
    ">

      <div
  className="
    w-16
    h-16
    rounded-3xl
    bg-gradient-to-r
    from-red-500
    to-rose-500
    flex
    items-center
    justify-center
    text-white
    text-2xl
    shadow-lg
  "
>
  🚨
</div>

      <h2 className="
        text-4xl
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
        font-medium
      ">
        Lotes vencidos
      </p>

    </div>

    {/* STOCK BAJO */}
    <div className="
      rounded-[28px]
      bg-orange-50
      border
      border-orange-100
      p-6
    ">
<div
  className="
    w-16
    h-16
    rounded-3xl
    bg-gradient-to-r
    from-orange-400
    to-amber-500
    flex
    items-center
    justify-center
    text-white
    text-2xl
    shadow-lg
  "
>
  ⚠️
</div>

      <h2 className="
        text-4xl
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
        font-medium
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
                bg-white
                rounded-[30px]
                border
                border-gray-100
                shadow-sm
                p-7
                text-left
                hover:shadow-xl
                hover:-translate-y-1
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

              <p className="text-4xl font-bold text-slate-900 mt-2">
                {tarjeta.total}
              </p>

            </button>
          )
        )}

      </div>

      {/* PRODUCTOS RECIENTES */}
      <div
        className="
          bg-white
          rounded-[32px]
          border
          border-gray-100
          shadow-sm
          overflow-hidden
        "
      >

        <div className="p-7 border-b border-gray-100">

          <h2 className="text-2xl font-bold text-slate-900">
            Productos recientes
          </h2>

          <p className="text-slate-400 mt-2">
            Últimos productos registrados.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Código
                </th>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Nombre
                </th>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Descripción
                </th>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Precio
                </th>

              </tr>

            </thead>

            <tbody>

              {productos
                .slice(0, 5)
                .map((producto) => (

                  <tr
                    key={
                      producto.idProducto ||
                      producto.id
                    }
                    className="
                      border-t
                      border-gray-100
                      hover:bg-slate-50
                    "
                  >

                    <td className="px-6 py-6 font-semibold text-slate-700">

                      {
                        producto.idProducto ||
                        producto.id
                      }

                    </td>

                    <td className="px-6 py-6 text-slate-700">

                      {
                        producto.nombre || "-"
                      }

                    </td>

                    <td className="px-6 py-6 text-slate-500">

                      {
                        producto.descripcion || "-"
                      }

                    </td>

                    <td className="px-6 py-6 font-bold text-slate-900">

                      Q
                      {Number(
                        producto.precio || 0
                      ).toFixed(2)}

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;