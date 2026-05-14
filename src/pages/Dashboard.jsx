import { useEffect, useMemo, useState } from "react";

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

  const obtenerEstado = (fecha) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diff = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";
    if (diff < 30) return "porVencer";
    return "vigente";
  };

  const estadisticas = useMemo(() => {
    const totalProductos = productos.length;
    const totalLotes = lotes.length;
    const totalVentas = ventas.length;

    const lotesPorVencer = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "porVencer"
    ).length;

    const lotesVencidos = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "vencido"
    ).length;

    const stockBajo = lotes.filter(
      (l) => Number(l.cantidad) <= 10
    ).length;

    const unidadesVendidas = ventas.reduce(
      (acc, venta) => acc + Number(venta.cantidadVendida),
      0
    );

    return {
      totalProductos,
      totalLotes,
      totalVentas,
      lotesPorVencer,
      lotesVencidos,
      stockBajo,
      unidadesVendidas
    };
  }, [productos, lotes, ventas]);

  const ultimosLotes = useMemo(() => {
    return [...lotes].slice(-4).reverse();
  }, [lotes]);

  const Card = ({
    titulo,
    valor,
    descripcion,
    icono,
    color
  }) => (
    <div
      className={`rounded-3xl p-6 text-white shadow-sm ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80">{titulo}</p>

          <h3 className="text-4xl font-bold mt-3">
            {valor}
          </h3>

          <p className="text-sm opacity-80 mt-3">
            {descripcion}
          </p>
        </div>

        <div className="text-4xl opacity-80">
          {icono}
        </div>
      </div>
    </div>
  );

  const MenuCard = ({
    titulo,
    descripcion,
    icono,
    onClick
  }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all text-left"
    >
      <div className="text-5xl mb-4">
        {icono}
      </div>

      <h3 className="text-2xl font-bold text-gray-800">
        {titulo}
      </h3>

      <p className="text-sm text-gray-500 mt-3">
        {descripcion}
      </p>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl shadow-sm p-8 text-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-sm text-blue-200 font-medium">
              Sistema farmacéutico
            </p>

            <h1 className="text-4xl font-bold mt-2">
              FarmaSystem Dashboard
            </h1>

            <p className="text-slate-200 mt-3 max-w-2xl">
              Controla productos, lotes, ventas y alertas
              importantes desde un solo lugar.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl px-6 py-5">
            <p className="text-sm text-slate-300">
              Estado del sistema
            </p>

            <h3 className="text-2xl font-bold mt-2 text-green-300">
              Operativo
            </h3>

            <p className="text-sm text-slate-300 mt-2">
              Todos los módulos funcionando correctamente.
            </p>
          </div>
        </div>
      </div>

      {/* MENÚ PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MenuCard
          titulo="Productos"
          descripcion="Gestiona el catálogo general."
          icono="💊"
          onClick={() => setVista("productos")}
        />

        <MenuCard
          titulo="Lotes"
          descripcion="Control de inventario y vencimientos."
          icono="📦"
          onClick={() => setVista("lotes")}
        />

        <MenuCard
          titulo="Ventas"
          descripcion="Punto de venta del sistema."
          icono="🛒"
          onClick={() => setVista("ventas")}
        />

        <MenuCard
          titulo="Facturación"
          descripcion="Módulo administrativo."
          icono="🧾"
          onClick={() => setVista("facturas")}
        />
      </div>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card
          titulo="Productos"
          valor={estadisticas.totalProductos}
          descripcion="Productos registrados"
          icono="💊"
          color="bg-gradient-to-r from-blue-600 to-blue-500"
        />

        <Card
          titulo="Lotes"
          valor={estadisticas.totalLotes}
          descripcion="Lotes activos"
          icono="📦"
          color="bg-gradient-to-r from-violet-600 to-violet-500"
        />

        <Card
          titulo="Ventas"
          valor={estadisticas.totalVentas}
          descripcion="Ventas registradas"
          icono="🛒"
          color="bg-gradient-to-r from-green-600 to-green-500"
        />

        <Card
          titulo="Unidades vendidas"
          valor={estadisticas.unidadesVendidas}
          descripcion="Productos vendidos"
          icono="📈"
          color="bg-gradient-to-r from-orange-500 to-orange-400"
        />
      </div>

      {/* ALERTAS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Alertas del sistema
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Información importante del inventario.
              </p>
            </div>

            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
              {estadisticas.lotesVencidos} vencidos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-yellow-50 border border-yellow-100 p-5">
              <div className="text-4xl">⏳</div>

              <h3 className="text-3xl font-bold text-yellow-700 mt-4">
                {estadisticas.lotesPorVencer}
              </h3>

              <p className="text-sm text-yellow-700 mt-2">
                Lotes próximos a vencer
              </p>
            </div>

            <div className="rounded-3xl bg-red-50 border border-red-100 p-5">
              <div className="text-4xl">🚨</div>

              <h3 className="text-3xl font-bold text-red-700 mt-4">
                {estadisticas.lotesVencidos}
              </h3>

              <p className="text-sm text-red-700 mt-2">
                Lotes vencidos
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 border border-orange-100 p-5">
              <div className="text-4xl">⚠️</div>

              <h3 className="text-3xl font-bold text-orange-700 mt-4">
                {estadisticas.stockBajo}
              </h3>

              <p className="text-sm text-orange-700 mt-2">
                Stock bajo
              </p>
            </div>
          </div>
        </div>

        {/* LOTES RECIENTES */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Últimos lotes
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Registros recientes del inventario.
          </p>

          {ultimosLotes.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-500">
                No hay lotes registrados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ultimosLotes.map((lote) => (
                <div
                  key={lote.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">
                      {lote.nombreProducto}
                    </h3>

                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {lote.codigoLote}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    Cantidad: {lote.cantidad}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Vence: {lote.fechaVencimiento}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;