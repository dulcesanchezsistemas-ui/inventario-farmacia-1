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
      `${p.id} ${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [productos, busqueda]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Catálogo de Productos
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Registra y consulta los productos conectados al backend.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registrar producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="id"
            placeholder="Código del producto"
            value={form.id}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={guardarProducto}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
          >
            Agregar producto
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
              Lista de productos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Productos guardados en la base de datos.
            </p>
          </div>

          <input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[320px]"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Código
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Nombre
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Descripción
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">
                  Precio
                </th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{p.id}</td>
                  <td className="p-4 text-gray-800 font-medium">{p.nombre}</td>
                  <td className="p-4 text-gray-600">{p.descripcion}</td>
                  <td className="p-4 text-gray-600">Q{p.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Productos;