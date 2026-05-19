import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  Save,
  X
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Productos({ setVista }) {
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [modoEdicion, setModoEdicion] = useState(false);

  const [idEditar, setIdEditar] = useState(null);

  const [formulario, setFormulario] = useState({
    idProducto: "",
    nombre: "",
    descripcion: "",
    precio: ""
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);

      const data = await res.json();

      setProductos(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar productos");
    }
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      idProducto: "",
      nombre: "",
      descripcion: "",
      precio: ""
    });

    setModoEdicion(false);
    setIdEditar(null);
  };

  const guardarProducto = async () => {
    try {
      const metodo = modoEdicion ? "PUT" : "POST";

      const url = modoEdicion
        ? `${API_URL}/productos/${idEditar}`
        : `${API_URL}/productos`;

      await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      });

      cargarProductos();

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    }
  };

  const editarProducto = (producto) => {
    setFormulario({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });

    setIdEditar(producto.idProducto);

    setModoEdicion(true);
  };

  const eliminarProducto = async (id) => {
    try {
      await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE"
      });

      cargarProductos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar producto");
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      `${p.idProducto} ${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [productos, busqueda]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={() => setVista("dashboard")}
            className="
              w-12
              h-12
              rounded-2xl
              bg-white
              border
              border-gray-100
              shadow-sm
              flex
              items-center
              justify-center
              hover:shadow-md
              transition-all
            "
          >
            <ArrowLeft
              size={20}
              className="text-slate-700"
            />
          </button>

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Productos
            </h1>

            <p className="text-slate-400 mt-2">
              Gestión del catálogo farmacéutico
            </p>

          </div>

        </div>

        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            px-5
            py-4
            shadow-sm
            flex
            items-center
            gap-4
          "
        >

          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Package
              size={22}
              className="text-blue-700"
            />
          </div>

          <div>

            <p className="text-sm text-slate-400">
              Total productos
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              {productos.length}
            </h3>

          </div>

        </div>
      </div>

      {/* FORM */}
      <div
        className="
          bg-white
          rounded-[32px]
          border
          border-gray-100
          p-8
          shadow-sm
        "
      >

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {modoEdicion
                ? "Editar producto"
                : "Nuevo producto"}
            </h2>

            <p className="text-slate-400 mt-2">
              Completa la información del producto.
            </p>

          </div>

          <div className="w-14 h-14 rounded-3xl bg-violet-100 flex items-center justify-center">
            <Package
              size={26}
              className="text-violet-700"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <input
            type="text"
            name="idProducto"
            placeholder="Código"
            value={formulario.idProducto}
            onChange={handleChange}
            className="
              h-14
              rounded-2xl
              border
              border-gray-100
              bg-slate-50
              px-5
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={handleChange}
            className="
              h-14
              rounded-2xl
              border
              border-gray-100
              bg-slate-50
              px-5
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />

          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={formulario.descripcion}
            onChange={handleChange}
            className="
              h-14
              rounded-2xl
              border
              border-gray-100
              bg-slate-50
              px-5
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />

          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formulario.precio}
            onChange={handleChange}
            className="
              h-14
              rounded-2xl
              border
              border-gray-100
              bg-slate-50
              px-5
              outline-none
              focus:ring-2
              focus:ring-violet-500
            "
          />

        </div>

        <div className="flex items-center gap-4 mt-8">

          <button
            onClick={guardarProducto}
            className="
              h-14
              px-8
              rounded-2xl
              bg-gradient-to-r
              from-violet-600
              to-blue-600
              text-white
              font-medium
              flex
              items-center
              gap-3
              hover:shadow-lg
              transition-all
            "
          >

            <Save size={18} />

            {modoEdicion
              ? "Actualizar"
              : "Guardar"}

          </button>

          <button
            onClick={limpiarFormulario}
            className="
              h-14
              px-8
              rounded-2xl
              bg-slate-100
              text-slate-700
              font-medium
              flex
              items-center
              gap-3
              hover:bg-slate-200
              transition-all
            "
          >

            <X size={18} />

            Limpiar

          </button>

        </div>

      </div>

      {/* TABLE */}
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

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Lista de productos
              </h2>

              <p className="text-slate-400 mt-2">
                Productos registrados en el sistema.
              </p>

            </div>

            <div
              className="
                relative
                w-full
                xl:w-[320px]
              "
            >

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-100
                  bg-slate-50
                  pl-12
                  pr-5
                  outline-none
                  focus:ring-2
                  focus:ring-violet-500
                "
              />

            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Código
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Nombre
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Descripción
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Precio
                </th>

                <th className="text-center px-6 py-5 text-sm font-semibold text-slate-500">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {productosFiltrados.map((producto) => (
                <tr
                  key={producto.idProducto}
                  className="
                    border-t
                    border-gray-100
                    hover:bg-slate-50
                    transition-all
                  "
                >

                  <td className="px-6 py-5 font-medium text-slate-700">
                    {producto.idProducto}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {producto.nombre}
                  </td>

                  <td className="px-6 py-5 text-slate-500">
                    {producto.descripcion}
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-800">
                    Q{Number(producto.precio).toFixed(2)}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center justify-center gap-3">

                      <button
                        onClick={() =>
                          editarProducto(producto)
                        }
                        className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-blue-100
                          text-blue-700
                          flex
                          items-center
                          justify-center
                          hover:scale-105
                          transition-all
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          eliminarProducto(
                            producto.idProducto
                          )
                        }
                        className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-red-100
                          text-red-700
                          flex
                          items-center
                          justify-center
                          hover:scale-105
                          transition-all
                        "
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

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

export default Productos;