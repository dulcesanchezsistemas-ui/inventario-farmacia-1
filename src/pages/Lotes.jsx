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
    const res = await fetch(`${API_URL}/productos`);
    const data = await res.json();
    setProductos(data);
  };

  const cargarLotes = async () => {
    const res = await fetch(`${API_URL}/lotes`);
    const data = await res.json();
    setLotes(data);
  };

  useEffect(() => {
    cargarProductos();
    cargarLotes();
  }, []);

  const convertirFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${month}-${day}-${year}`;
  };

  const obtenerNombreProducto = (idProducto) => {
    const producto = productos.find((p) => p.id === idProducto);
    return producto ? producto.nombre : idProducto;
  };

  const obtenerEstado = (fecha) => {
    const fechaReal = fecha.includes("-") && fecha.split("-")[0].length === 2
      ? new Date(fecha.replace(/-/g, "/"))
      : new Date(fecha);

    const hoy = new Date();
    const diff = (fechaReal - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";
    if (diff < 30) return "porVencer";
    return "vigente";
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Lotes</h1>
        <p className="text-sm text-gray-500 mt-2">
          Registra lotes conectados a productos existentes.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registrar lote
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <input
            name="idLote"
            placeholder="Código de lote"
            value={form.idLote}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="idProducto"
            value={form.idProducto}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={form.cantidad}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-medium">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              name="fechaVencimiento"
              value={form.fechaVencimiento}
              onChange={handleChange}
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={guardarLote}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
          >
            Agregar lote
          </button>

          <button
            onClick={limpiar}
            className="bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all text-gray-800 px-5 py-3 rounded-xl font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de lotes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lotes registrados en la base de datos.
            </p>
          </div>

          <input
            placeholder="Buscar lote o producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[320px]"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[900px]">
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
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>
              {lotesFiltrados.map((l) => {
                const estado = obtenerEstado(l.fechaVencimiento);

                return (
                  <tr key={l.idLote} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{l.idLote}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {obtenerNombreProducto(l.idProducto)}
                    </td>
                    <td className="p-4 text-gray-600">{l.cantidad}</td>
                    <td className="p-4 text-gray-600">{l.fechaVencimiento}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lotes;