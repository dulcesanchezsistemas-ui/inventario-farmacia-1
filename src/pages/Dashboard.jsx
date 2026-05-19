import { useEffect, useMemo, useState } from "react";

import {
  Package,
  Boxes,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Activity,
  Receipt,
  ShieldCheck,
  Clock3
} from "lucide-react";

function Dashboard({ setVista }) {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const dataProductos = localStorage.getItem("productosCatalogo");
    const dataLotes = localStorage.getItem("lotesInventario");
    const dataVentas = localStorage.getItem("ventasProductos");

    setProductos(dataProductos ? JSON.parse(dataProductos) : []);
    setLotes(dataLotes ? JSON.parse(dataLotes) : []);
    setVentas(dataVentas ? JSON.parse(dataVentas) : []);
  }, []);

  const estadisticas = useMemo(() => {
    return {
      productos: productos.length,
      lotes: lotes.length,
      ventas: ventas.length,
      stockBajo: lotes.filter((l) => Number(l.cantidad) <= 10).length
    };
  }, [productos, lotes, ventas]);

  const StatCard = ({
    titulo,
    valor,
    icono,
    color
  }) => (
    <div
      className="
        bg-white
        rounded-[28px]
        p-6
        border
        border-gray-100
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-400 font-medium">
            {titulo}
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-4">
            {valor}
          </h2>

        </div>

        <div
          className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            ${color}
          `}
        >
          {icono}
        </div>

      </div>
    </div>
  );

  const ActionCard = ({
    titulo,
    descripcion,
    icono,
    onClick,
    color
  }) => (
    <button
      onClick={onClick}
      className="
        group
        bg-white
        rounded-[30px]
        border
        border-gray-100
        p-6
        text-left
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div
        className={`
          w-14
          h-14
          rounded-2xl
          flex
          items-center
          justify-center
          ${color}
        `}
      >
        {icono}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mt-6">
        {titulo}
      </h3>

      <p className="text-sm text-slate-400 mt-2 leading-relaxed">
        {descripcion}
      </p>

      <div className="flex items-center gap-2 mt-6 text-violet-600 font-medium text-sm">

        Abrir módulo

        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-all"
        />

      </div>

    </button>
  );

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[38px]
          bg-gradient-to-r
          from-violet-600
          via-blue-600
          to-cyan-500
          p-10
          text-white
          shadow-2xl
        "
      >

        {/* Glow */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

          {/* LEFT */}
          <div>

            <p className="uppercase tracking-[6px] text-sm text-white/70">
              Smart Pharmacy Dashboard
            </p>

            <h1 className="text-6xl font-bold mt-6 tracking-tight">
              FarmaSystem
            </h1>

            <p className="mt-5 text-white/80 max-w-2xl text-lg leading-relaxed">
              Plataforma moderna para administración farmacéutica,
              inventario inteligente, ventas y facturación.
            </p>

            {/* STATUS */}
            <div className="flex items-center gap-4 mt-10">

              <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>

                <div>

                  <p className="text-sm text-white/70">
                    Estado sistema
                  </p>

                  <p className="font-semibold text-lg">
                    Operativo
                  </p>

                </div>

              </div>

              <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Clock3 size={24} />
                </div>

                <div>

                  <p className="text-sm text-white/70">
                    Última actividad
                  </p>

                  <p className="font-semibold text-lg">
                    Hace 2 min
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          titulo="Productos"
          valor={estadisticas.productos}
          icono={<Package size={26} className="text-blue-700" />}
          color="bg-blue-100"
        />

        <StatCard
          titulo="Lotes"
          valor={estadisticas.lotes}
          icono={<Boxes size={26} className="text-violet-700" />}
          color="bg-violet-100"
        />

        <StatCard
          titulo="Ventas"
          valor={estadisticas.ventas}
          icono={<ShoppingCart size={26} className="text-green-700" />}
          color="bg-green-100"
        />

        <StatCard
          titulo="Stock bajo"
          valor={estadisticas.stockBajo}
          icono={<AlertTriangle size={26} className="text-orange-700" />}
          color="bg-orange-100"
        />

      </div>

      {/* MODULES */}
      <div>

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">
              Módulos
            </h2>

            <p className="text-slate-400 mt-2">
              Administración principal del sistema
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <ActionCard
            titulo="Productos"
            descripcion="Gestión del catálogo farmacéutico."
            icono={<Package size={28} className="text-blue-700" />}
            color="bg-blue-100"
            onClick={() => setVista("productos")}
          />

          <ActionCard
            titulo="Lotes"
            descripcion="Control de inventario y vencimientos."
            icono={<Boxes size={28} className="text-violet-700" />}
            color="bg-violet-100"
            onClick={() => setVista("lotes")}
          />

          <ActionCard
            titulo="Ventas"
            descripcion="Punto de venta farmacéutico."
            icono={<ShoppingCart size={28} className="text-green-700" />}
            color="bg-green-100"
            onClick={() => setVista("ventas")}
          />

          <ActionCard
            titulo="Facturas"
            descripcion="Facturación y control administrativo."
            icono={<Receipt size={28} className="text-orange-700" />}
            color="bg-orange-100"
            onClick={() => setVista("facturas")}
          />

        </div>
      </div>

      {/* LOWER */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ACTIVITY */}
        <div className="xl:col-span-2 bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Actividad reciente
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                Últimos movimientos registrados
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Activity size={24} className="text-slate-700" />
            </div>

          </div>

          <div className="space-y-4">

            {[
              "Nueva venta registrada",
              "Inventario actualizado",
              "Factura procesada",
              "Lote agregado correctamente"
            ].map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  bg-slate-50
                  rounded-2xl
                  px-5
                  py-4
                  hover:bg-slate-100
                  transition-all
                "
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
                    ✨
                  </div>

                  <div>

                    <p className="font-medium text-slate-800">
                      {item}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Hace unos minutos
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300"
                />

              </div>
            ))}

          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Alertas
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Estado general del sistema
          </p>

          <div className="space-y-5 mt-8">

            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">

              <p className="text-sm text-orange-500">
                Productos con stock bajo
              </p>

              <h3 className="text-5xl font-bold text-orange-600 mt-4">
                {estadisticas.stockBajo}
              </h3>

            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">

              <p className="text-sm text-blue-500">
                Productos registrados
              </p>

              <h3 className="text-5xl font-bold text-blue-600 mt-4">
                {estadisticas.productos}
              </h3>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;