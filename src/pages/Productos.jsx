import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: ""
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

  useEffect(() => {
    cargarProductos();
  }, []);

  const obtenerIdProducto = (producto) => {
    return producto.idProducto || producto.id;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiar = () => {
    setForm({
      id: "",
      nombre: "",
      descripcion: "",
      precio: ""
    });
  };

  const guardarProducto = async () => {
    if (!form.id || !form.nombre || !form.descripcion || form.precio === "") {
      alert("Completa todos los campos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: form.id,
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: Number(form.precio)
        })
      });

      if (!res.ok) throw new Error("Error al guardar producto");

      await cargarProductos();
      limpiar();
      alert("Producto agregado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto.");
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      `${obtenerIdProducto(p)} ${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [productos, busqueda]);

  const totalProductos = productos.length;

  const precioPromedio =
    totalProductos > 0
      ? (
          productos.reduce((acc, p) => acc + Number(p.precio), 0) /
          totalProductos
        ).toFixed(2)
      : "0.00";

  const productoMasCaro =
    totalProductos > 0
      ? [...productos].sort((a, b) => Number(b.precio) - Number(a.precio))[0]
      : null;

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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl shadow-sm p-8 text-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-sm text-blue-200 font-medium">
              Catálogo general
            </p>

            <h1 className="text-3xl font-bold mt-2">Productos</h1>

            <p className="text-slate-200 mt-2 max-w-2xl">
              Administra los productos registrados en el sistema. Cada producto
              puede tener lotes asociados para control de inventario.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl px-6 py-5">
            <p className="text-sm text-slate-300">Productos registrados</p>
            <h3 className="text-3xl font-bold text-green-300 mt-2">
              {totalProductos}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard
          titulo="Total"
          valor={totalProductos}
          descripcion="Productos disponibles en catálogo"
          icono="💊"
          color="bg-gradient-to-r from-blue-600 to-blue-500"
        />

        <StatCard
          titulo="Precio promedio"
          valor={`Q${precioPromedio}`}
          descripcion="Promedio general de precios"
          icono="📊"
          color="bg-gradient-to-r from-violet-600 to-violet-500"
        />

        <StatCard
          titulo="Mayor precio"
          valor={productoMasCaro ? productoMasCaro.nombre : "N/A"}
          descripcion={
            productoMasCaro ? `Q${Number(productoMasCaro.precio).toFixed(2)}` : "Sin datos"
          }
          icono="💰"
          color="bg-gradient-to-r from-green-600 to-green-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Registrar producto
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ingresa los datos principales del producto.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Código
              </label>
              <input
                name="id"
                placeholder="Ej. PROD001"
                value={form.id}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Nombre
              </label>
              <input
                name="nombre"
                placeholder="Nombre del producto"
                value={form.nombre}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Descripción
              </label>
              <textarea
                name="descripcion"
                placeholder="Descripción o uso del producto"
                value={form.descripcion}
                onChange={handleChange}
                rows="3"
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 font-medium">
                Precio
              </label>
              <input
                type="number"
                name="precio"
                placeholder="Q0.00"
                value={form.precio}
                onChange={handleChange}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={guardarProducto}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-2xl font-semibold shadow-sm"
            >
              Agregar producto
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
                Lista de productos
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Productos registrados en el backend.
              </p>
            </div>

            <input
              placeholder="Buscar por código, nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 xl:min-w-[340px]"
            />
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-5xl mb-3">💊</div>
              <p className="text-gray-500">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-100">
              <table className="w-full min-w-[850px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Código
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Producto
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Descripción
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Precio
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-600">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productosFiltrados.map((p) => (
                    <tr
                      key={obtenerIdProducto(p)}
                      className="border-t hover:bg-gray-50 transition-all"
                    >
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {obtenerIdProducto(p)}
                        </span>
                      </td>

                      <td className="p-4 text-gray-800 font-semibold">
                        {p.nombre}
                      </td>

                      <td className="p-4 text-gray-600">
                        {p.descripcion}
                      </td>

                      <td className="p-4 text-green-600 font-bold">
                        Q{Number(p.precio).toFixed(2)}
                      </td>

                      <td className="p-4">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Productos;