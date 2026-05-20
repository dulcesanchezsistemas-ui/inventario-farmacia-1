import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Productos({ setVista }) {
  const [productos, setProductos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [productoActual, setProductoActual] =
    useState({
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
      const res = await fetch(
        `${API_URL}/productos`
      );

      const data = await res.json();

      setProductos(data);
    } catch (error) {
      console.error(error);

      alert(
        "Error al cargar productos"
      );
    }
  };

  const abrirNuevoProducto = () => {
    setModoEdicion(false);

    setProductoActual({
      idProducto: "",
      nombre: "",
      descripcion: "",
      precio: ""
    });

    setMostrarModal(true);
  };

  const abrirEditarProducto = (
    producto
  ) => {
    setModoEdicion(true);

    setProductoActual(producto);

    setMostrarModal(true);
  };

  const guardarProducto = async (
    e
  ) => {
    e.preventDefault();

    try {
      // EDITAR
      if (modoEdicion) {
        const res = await fetch(
          `${API_URL}/productos/${productoActual.idProducto}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              nombre:
                productoActual.nombre,
              descripcion:
                productoActual.descripcion,
              precio:
                Number(
                  productoActual.precio
                )
            })
          }
        );

        if (!res.ok) {
          throw new Error(
            "Error al actualizar"
          );
        }

        alert(
          "Producto actualizado"
        );
      }

      // CREAR
      else {
        const res = await fetch(
          `${API_URL}/productos`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify(
              productoActual
            )
          }
        );

        if (!res.ok) {
          throw new Error(
            "Error al crear"
          );
        }

        alert("Producto creado");
      }

      setMostrarModal(false);

      cargarProductos();
    } catch (error) {
      console.error(error);

      alert(
        "Error al guardar producto"
      );
    }
  };

  const eliminarProducto = async (
    idProducto
  ) => {
    const confirmar = confirm(
      "¿Deseas eliminar este producto?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `${API_URL}/productos/${idProducto}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error al eliminar"
        );
      }

      alert("Producto eliminado");

      cargarProductos();
    } catch (error) {
      console.error(error);

      alert(
        "Error al eliminar producto"
      );
    }
  };

  const productosFiltrados =
    useMemo(() => {
      return productos.filter(
        (producto) =>
          `${producto.idProducto} ${producto.nombre} ${producto.descripcion}`
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )
      );
    }, [productos, busqueda]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setVista("dashboard")
            }
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
              Gestión de productos farmacéuticos
            </p>

          </div>

        </div>

        <button
          onClick={
            abrirNuevoProducto
          }
          className="
            px-6
            h-14
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            text-white
            font-semibold
            flex
            items-center
            gap-3
            shadow-lg
            hover:scale-105
            transition-all
          "
        >

          <Plus size={20} />

          Nuevo producto

        </button>

      </div>

      {/* SEARCH */}
      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-[32px]
          shadow-sm
          p-6
        "
      >

        <div className="relative w-full">

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
              setBusqueda(
                e.target.value
              )
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

                <th className="px-6 py-5 text-center text-sm font-semibold text-slate-500">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {productosFiltrados.map(
                (producto) => (
                  <tr
                    key={
                      producto.idProducto
                    }
                    className="
                      border-t
                      border-gray-100
                      hover:bg-slate-50
                      transition-all
                    "
                  >

                    <td className="px-6 py-6 font-semibold text-slate-700">
                      {
                        producto.idProducto
                      }
                    </td>

                    <td className="px-6 py-6 text-slate-700">
                      {
                        producto.nombre
                      }
                    </td>

                    <td className="px-6 py-6 text-slate-500">
                      {
                        producto.descripcion
                      }
                    </td>

                    <td className="px-6 py-6 font-bold text-slate-900">
                      Q
                      {Number(
                        producto.precio
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-6">

                      <div className="flex items-center justify-center gap-3">

                        {/* EDITAR */}
                        <button
                          onClick={() =>
                            abrirEditarProducto(
                              producto
                            )
                          }
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-blue-100
                            text-blue-700
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-200
                            transition-all
                          "
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        {/* ELIMINAR */}
                        <button
                          onClick={() =>
                            eliminarProducto(
                              producto.idProducto
                            )
                          }
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-red-100
                            text-red-700
                            flex
                            items-center
                            justify-center
                            hover:bg-red-200
                            transition-all
                          "
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-6
          "
        >

          <div
            className="
              bg-white
              rounded-[32px]
              w-full
              max-w-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                px-8
                py-7
                text-white
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2 className="text-3xl font-bold">
                  {modoEdicion
                    ? "Editar producto"
                    : "Nuevo producto"}
                </h2>

                <p className="text-white/80 mt-2">
                  Gestión farmacéutica
                </p>

              </div>

              <button
                onClick={() =>
                  setMostrarModal(false)
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white/10
                  hover:bg-white/20
                  transition-all
                  flex
                  items-center
                  justify-center
                "
              >
                <X size={24} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={guardarProducto}
              className="p-8 space-y-6"
            >

              {/* CODIGO */}
              {!modoEdicion && (
                <div>

                  <label className="block text-sm font-semibold text-slate-600 mb-3">
                    Código
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      productoActual.idProducto
                    }
                    onChange={(e) =>
                      setProductoActual({
                        ...productoActual,
                        idProducto:
                          e.target.value
                      })
                    }
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-200
                      px-5
                      outline-none
                      focus:ring-2
                      focus:ring-violet-500
                    "
                  />

                </div>
              )}

              {/* NOMBRE */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-3">
                  Nombre
                </label>

                <input
                  type="text"
                  required
                  value={
                    productoActual.nombre
                  }
                  onChange={(e) =>
                    setProductoActual({
                      ...productoActual,
                      nombre:
                        e.target.value
                    })
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    px-5
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />

              </div>

              {/* DESCRIPCION */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-3">
                  Descripción
                </label>

                <textarea
                  required
                  value={
                    productoActual.descripcion
                  }
                  onChange={(e) =>
                    setProductoActual({
                      ...productoActual,
                      descripcion:
                        e.target.value
                    })
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    p-5
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                  "
                  rows={4}
                />

              </div>

              {/* PRECIO */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-3">
                  Precio
                </label>

                <input
                  type="number"
                  step="0.01"
                  required
                  value={
                    productoActual.precio
                  }
                  onChange={(e) =>
                    setProductoActual({
                      ...productoActual,
                      precio:
                        e.target.value
                    })
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    px-5
                    outline-none
                    focus:ring-2
                    focus:ring-violet-500
                  "
                />

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-4 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setMostrarModal(false)
                  }
                  className="
                    px-6
                    h-14
                    rounded-2xl
                    bg-slate-100
                    text-slate-700
                    font-semibold
                    hover:bg-slate-200
                    transition-all
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="
                    px-6
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    text-white
                    font-semibold
                    shadow-lg
                    hover:scale-105
                    transition-all
                  "
                >
                  {modoEdicion
                    ? "Actualizar"
                    : "Guardar"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Productos;