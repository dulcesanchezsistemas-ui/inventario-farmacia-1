import { useEffect, useMemo, useState } from "react";

function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const dataProductos = localStorage.getItem("productosCatalogo");
    const dataLotes = localStorage.getItem("lotesInventario");
    const dataVentas = localStorage.getItem("ventasProductos");

    if (dataProductos) {
      setProductos(JSON.parse(dataProductos));
    } else {
      setProductos([]);
    }

    if (dataLotes) {
      setLotes(JSON.parse(dataLotes));
    } else {
      setLotes([]);
    }

    if (dataVentas) {
      setVentas(JSON.parse(dataVentas));
    } else {
      setVentas([]);
    }
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

    const lotesVigentes = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "vigente"
    ).length;

    const lotesPorVencer = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "porVencer"
    ).length;

    const lotesVencidos = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "vencido"
    ).length;

    const stockBajo = lotes.filter((l) => Number(l.cantidad) <= 10).length;

    const unidadesVendidas = ventas.reduce(
      (acc, venta) => acc + Number(venta.cantidadVendida),
      0
    );

    return {
      totalProductos,
      totalLotes,
      totalVentas,
      lotesVigentes,
      lotesPorVencer,
      lotesVencidos,
      stockBajo,
      unidadesVendidas
    };
  }, [productos, lotes, ventas]);

  const alertas = useMemo(() => {
    return lotes.filter((l) => {
      const estado = obtenerEstado(l.fechaVencimiento);
      return (
        estado === "vencido" ||
        estado === "porVencer" ||
        Number(l.cantidad) <= 10
      );
    });
  }, [lotes]);

  const ultimosLotes = useMemo(() => {
    return [...lotes].slice(-4).reverse();
  }, [lotes]);

  const productoMasVendido = useMemo(() => {
    if (ventas.length === 0) return null;

    const conteo = {};

    ventas.forEach((venta) => {
      if (!conteo[venta.nombreProducto]) {
        conteo[venta.nombreProducto] = 0;
      }
      conteo[venta.nombreProducto] += Number(venta.cantidadVendida);
    });

    const nombre = Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );

    return nombre;
  }, [ventas]);

  const Card = ({ titulo, valor, descripcion, icono, clases = "bg-white" }) => (
    <div
      className={`rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${clases}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{titulo}</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-800">{valor}</h3>
          <p className="text-sm text-gray-500 mt-2">{descripcion}</p>
        </div>
        <div className="text-3xl">{icono}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de Control del Sistema
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Visualiza el resumen general del catálogo, lotes, ventas y alertas
          importantes del inventario.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          titulo="Productos"
          valor={estadisticas.totalProductos}
          descripcion="Productos en el catálogo"
          icono="💊"
        />

        <Card
          titulo="Lotes"
          valor={estadisticas.totalLotes}
          descripcion="Lotes registrados"
          icono="📦"
        />

        <Card
          titulo="Ventas"
          valor={estadisticas.totalVentas}
          descripcion="Ventas registradas"
          icono="🛒"
        />

        <Card
          titulo="Unidades vendidas"
          valor={estadisticas.unidadesVendidas}
          descripcion="Cantidad total vendida"
          icono="📈"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          titulo="Lotes vigentes"
          valor={estadisticas.lotesVigentes}
          descripcion="Lotes en estado correcto"
          icono="✅"
        />

        <Card
          titulo="Por vencer"
          valor={estadisticas.lotesPorVencer}
          descripcion="Requieren revisión próxima"
          icono="⏳"
        />

        <Card
          titulo="Vencidos"
          valor={estadisticas.lotesVencidos}
          descripcion="Necesitan atención inmediata"
          icono="🚨"
        />

        <Card
          titulo="Stock bajo"
          valor={estadisticas.stockBajo}
          descripcion="Lotes con poca cantidad"
          icono="⚠️"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Resumen del sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-500">Estado general</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                {estadisticas.lotesVencidos > 0
                  ? "Existen lotes vencidos que requieren atención"
                  : "El inventario se encuentra estable"}
              </h3>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-500">Prioridad actual</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                {estadisticas.lotesPorVencer > 0
                  ? "Revisar lotes próximos a vencer"
                  : "Sin alertas cercanas de vencimiento"}
              </h3>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-500">Control de stock</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                {estadisticas.stockBajo > 0
                  ? "Hay lotes con cantidad baja"
                  : "Cantidad en niveles adecuados"}
              </h3>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-500">Producto más vendido</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                {productoMasVendido || "Sin ventas registradas"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Alertas rápidas
          </h2>

          {alertas.length === 0 ? (
            <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
              <p className="text-green-700 font-medium">Todo está en orden.</p>
              <p className="text-sm text-green-600 mt-1">
                No hay lotes con alertas por el momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.slice(0, 5).map((lote) => {
                const estado = obtenerEstado(lote.fechaVencimiento);
                const esStockBajo = Number(lote.cantidad) <= 10;

                return (
                  <div
                    key={lote.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {lote.nombreProducto}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Lote: {lote.codigoLote}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          estado === "vencido"
                            ? "bg-red-100 text-red-700"
                            : estado === "porVencer"
                            ? "bg-orange-100 text-orange-700"
                            : esStockBajo
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {estado === "vencido"
                          ? "Vencido"
                          : estado === "porVencer"
                          ? "Por vencer"
                          : esStockBajo
                          ? "Stock bajo"
                          : "Vigente"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      Vencimiento: {lote.fechaVencimiento} | Cantidad:{" "}
                      {lote.cantidad}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Últimos lotes registrados
        </h2>

        {ultimosLotes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No hay lotes registrados todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {ultimosLotes.map((lote) => {
              const estado = obtenerEstado(lote.fechaVencimiento);

              return (
                <div
                  key={lote.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      {lote.nombreProducto}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        estado === "vencido"
                          ? "bg-red-100 text-red-700"
                          : estado === "porVencer"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {estado === "vencido"
                        ? "Vencido"
                        : estado === "porVencer"
                        ? "Por vencer"
                        : "Vigente"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Lote: {lote.codigoLote}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ingreso: {lote.fechaIngreso}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Vencimiento: {lote.fechaVencimiento}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Cantidad: {lote.cantidad}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;