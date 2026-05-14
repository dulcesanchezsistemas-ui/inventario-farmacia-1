import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000";

function Lotes() {
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);

  const [form, setForm] = useState({
    idLote: "",
    idProducto: "",
    cantidad: "",
    fechaVencimiento: ""
  });

  const [busqueda, setBusqueda] = useState("");

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los productos.");
    }
  };

  const cargarLotes = async () => {
    try {
      const res = await fetch(`${API_URL}/lotes`);
      const data = await res.json();
      setLotes(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los lotes.");
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarLotes();
  }, []);

  const obtenerIdProducto = (producto) => {
    return producto.idProducto || producto.id;
  };

  const obtenerNombreProducto = (idProducto) => {
    const producto = productos.find(
      (p) => String(obtenerIdProducto(p)) === String(idProducto)
    );

    return producto ? producto.nombre : idProducto;
  };

  const convertirFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${month}-${day}-${year}`;
  };

  const parseFecha = (fecha) => {
    if (!fecha) return new Date();

    const partes = fecha.split("-");

    if (partes[0]?.length === 2) {
      return new Date(`${partes[2]}-${partes[0]}-${partes[1]}`);
    }

    return new Date(fecha);
  };

  const obtenerEstado = (fecha) => {
    const hoy = new Date();
    const vencimiento = parseFecha(fecha);
    const diff = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";
    if (diff < 30) return "porVencer";
    return "vigente";
  };

  const diasRestantes = (fecha) => {
    const hoy = new Date();
    const vencimiento = parseFecha(fecha);
    return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiar = () => {
    setForm({
      idLote: "",
      idProducto: "",
      cantidad: "",
      fechaVencimiento: ""
    });
  };

  const guardarLote = async () => {
    if (
      !form.idLote ||
      !form.idProducto ||
      form.cantidad === "" ||
      !form.fechaVencimiento
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (Number(form.cantidad) <= 0) {
      alert("La cantidad debe ser mayor que cero.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/lotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idLote: form.idLote,
          idProducto: form.idProducto,
          cantidad: Number(form.cantidad),
          fechaVencimiento: convertirFecha(form.fechaVencimiento)
        })
      });

      if (!res.ok) throw new Error("Error al guardar lote");

      await cargarLotes();
      limpiar();

      alert("Lote agregado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar lote.");
    }
  };

  const lotesFiltrados = useMemo(() => {
    return lotes.filter((l) =>
      `${l.idLote} ${l.idProducto} ${obtenerNombreProducto(l.idProducto)}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [lotes, busqueda, productos]);

  const estadisticas = useMemo(() => {
    const total = lotes.length;

    const vigentes = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "vigente"
    ).length;

    const porVencer = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "porVencer"
    ).length;

    const vencidos = lotes.filter(
      (l) => obtenerEstado(l.fechaVencimiento) === "vencido"
    ).length;

    const stockBajo = lotes.filter((l) => Number(l.cantidad) <= 10).length;

    return {
      total,
      vigentes,
      porVencer,
      vencidos,
      stockBajo
    };
  }, [lotes]);

  const StatCard = ({ titulo, valor, descripcion, icono, color }) => (
    <div className={`rounded-3xl p-6 text-white shadow-sm ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80">{titulo}</p>
          <h3 className="text-3xl font-bold mt-3">{valor}</h3>
          <p className="text-sm opacity-80 mt-3">{descripcion}</p>
        </div>

        <div className="text-4xl opacity-80">{icono}</div>
      </div>
    </div>
  );

  const EstadoBadge = ({ estado }) => {
    const clases =
      estado === "vencido"
        ? "bg-red-50 text-red-700"
        : estado === "porVencer"
        ? "bg-orange-50 text-orange-700"
        : "bg-green-50 text-green-700";

    const texto =
      estado === "vencido"
        ? "Vencido"
        : estado === "porVencer"
        ? "Por vencer"
        : "Vigente";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${clases}`}>
        {texto}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl shadow-sm p-8 text-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-sm text-blue-200 font-medium">
              Control de inventario
            </p>

            <h1 className="text-3xl font-bold mt-2">Lotes</h1>

            <p className="text-slate-200 mt-2 max-w-2xl">
              Administra cantidades, vencimientos y disponibilidad de cada lote
              asociado a los productos.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl px-6 py-5">
            <p className="text-sm text-slate-300">Lotes registrados</p>
            <h3 className="text-3xl font-bold text-green-300 mt-2">
              {estadisticas.total}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          titulo="Total"
          valor={estadisticas.total}
          descripcion="Lotes en inventario"
          icono="📦"
          color="bg-gradient-to-r from-blue-600 to-blue-500"
        />

        <StatCard
          titulo="Vigentes"
          valor={estadisticas.vigentes}
          descripcion="Disponibles correctamente"
          icono="✅"
          color="bg-gradient-to-r from-green-600 to-green-500"
        />

        <StatCard
          titulo="Por vencer"
          valor={estadisticas.porVencer}
          descripcion="Requieren revisión"
          icono="⏳"
          color="bg-gradient-to-r from-orange-500 to-orange-400"
        />

        <StatCard
          titulo="Vencidos"
          valor={estadisticas.vencidos}
          descripcion="Atención inmediata"
          icono="🚨"
          color="bg-gradient-to-r from-red-600 to-red-500"
        />

        <StatCard
          titulo="Stock bajo"
          valor={estadisticas.stockBajo}
          descripcion="Cantidad menor o igual a 10"
          icono="⚠️"
          color="bg-gradient-to-r from-violet-600 to-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Registrar lote
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Agrega existencias por producto.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Código de lote
              </label>
              <input
                name="idLote"
                placeholder="Ej. LOT001"
                value={form.idLote}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Producto
              </label>
              <select
                name="idProducto"
                value={form.idProducto}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona producto</option>
                {productos.map((p) => (
                  <option key={obtenerIdProducto(p)} value={obtenerIdProducto(p)}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Cantidad
              </label>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad disponible"
                value={form.cantidad}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                name="fechaVencimiento"
                value={form.fechaVencimiento}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={guardarLote}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-2xl font-semibold shadow-sm"
            >
              Agregar lote
            </button>

            <button
              onClick={limpiar}
              className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-gray-700 px-5 py-3 rounded-2xl font-semibold"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Lista de lotes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Lotes registrados en la base de datos.
              </p>
            </div>

            <input
              placeholder="Buscar por lote o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 xl:min-w-[340px]"
            />
          </div>

          {lotesFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-gray-500">No se encontraron lotes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-100">
              <table className="w-full min-w-[950px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Lote
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Producto
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Cantidad
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Vencimiento
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Días restantes
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lotesFiltrados.map((l) => {
                    const estado = obtenerEstado(l.fechaVencimiento);
                    const dias = diasRestantes(l.fechaVencimiento);

                    return (
                      <tr
                        key={l.idLote}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            {l.idLote}
                          </span>
                        </td>

                        <td className="p-4 text-gray-800 font-semibold">
                          {obtenerNombreProducto(l.idProducto)}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              Number(l.cantidad) <= 10
                                ? "bg-orange-50 text-orange-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            {l.cantidad} unidades
                          </span>
                        </td>

                        <td className="p-4 text-gray-600">
                          {l.fechaVencimiento}
                        </td>

                        <td className="p-4 text-gray-600">
                          {dias < 0 ? "Vencido" : `${dias} días`}
                        </td>

                        <td className="p-4">
                          <EstadoBadge estado={estado} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lotes;