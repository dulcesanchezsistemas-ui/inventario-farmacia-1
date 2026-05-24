import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
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

  // =========================
  // CARGAR PRODUCTOS
  // =========================
  useEffect(() => {
    cargarProductos();
  }, []);

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

      alert(
        "Error al cargar productos"
      );
    }
  };

  // =========================
  // NUEVO PRODUCTO
  // =========================
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

  // =========================
  // EDITAR PRODUCTO
  // =========================
  const abrirEditarProducto = (
    producto
  ) => {

    setModoEdicion(true);

    setProductoActual({

      idProducto:
        producto.idProducto ||
        producto.id ||
        "",

      nombre:
        producto.nombre || "",

      descripcion:
        producto.descripcion || "",

      precio:
        producto.precio || ""

    });

    setMostrarModal(true);
  };

  // =========================
  // GUARDAR PRODUCTO
  // =========================
  const guardarProducto = async (
    e
  ) => {

    e.preventDefault();

    try {

      if (
        !productoActual.nombre ||
        !productoActual.descripcion ||
        productoActual.precio === ""
      ) {
        return alert(
          "Completa todos los campos"
        );
      }

      // =====================
      // EDITAR
      // =====================
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

              precio: Number(
                productoActual.precio
              )

            })
          }
        );

        if (!res.ok) {
          throw new Error(
            "Error al actualizar producto"
          );
        }

        alert(
          "Producto actualizado"
        );
      }

      // =====================
      // CREAR
      // =====================
      else {

        const bodyEnviar = {

          id:
            productoActual.idProducto,

          nombre:
            productoActual.nombre,

          descripcion:
            productoActual.descripcion,

          precio: Number(
            productoActual.precio
          )

        };

        const res = await fetch(
          `${API_URL}/productos`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
              bodyEnviar
            )
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
            "Error al crear producto"
          );
        }

        alert(
          "Producto creado"
        );
      }

      setMostrarModal(false);

      cargarProductos();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Error al guardar producto"
      );
    }
  };

  // =========================
  // ELIMINAR PRODUCTO
  // =========================
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
          "Error al eliminar producto"
        );
      }

      alert(
        "Producto eliminado"
      );

      cargarProductos();

    } catch (error) {

      console.error(error);

      alert(
        "Error al eliminar producto"
      );
    }
  };

  // =========================
  // FILTRAR PRODUCTOS
  // =========================
  const productosFiltrados =
    useMemo(() => {

      return productos.filter(
        (producto) =>
          `${
            producto.idProducto ||
            producto.id
          } ${producto.nombre || ""} ${
            producto.descripcion || ""
          }`
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )
      );

    }, [productos, busqueda]);

  return (

    <div className="space-y-8">

      {/* HEADER */}
<div className="
  flex
  flex-col
  xl:flex-row
  xl:items-center
  xl:justify-between
  gap-6
">

  {/* TITULO */}
  <div className="flex items-center gap-4">

    <button
      onClick={() =>
        setVista("dashboard")
      }
      className="
        w-14
        h-14
        rounded-3xl
        bg-[#ffffff]
        border
        border-[#e8eefc]
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        flex
        items-center
        justify-center
      "
    >
      <ArrowLeft
        size={22}
        className="text-slate-700"
      />
    </button>

    <div>

      <h1 className="
        text-4xl
        font-black
        text-slate-900
      ">
        Registrar producto
      </h1>

      <p className="
        text-slate-400
        mt-2
      ">
        Administración farmacéutica
      </p>

    </div>

  </div>

  {/* BOTON */}
  <button
    onClick={
      abrirNuevoProducto
    }
    className="
      h-14
      px-7
      rounded-3xl
      bg-gradient-to-r
      from-emerald-500
      to-cyan-500
      text-white
      font-semibold
      flex
      items-center
      gap-3
      shadow-lg
      hover:scale-[1.02]
      transition-all
    "
  >

    <Plus size={20} />

    Nuevo producto

  </button>

</div>

     {/* GRID PRINCIPAL */}

<div className="
  grid
  grid-cols-1
  xl:grid-cols-[420px_1fr]
  gap-6
">

  <div
  className="
    bg-[#ffffff]
    rounded-[28px]
    border
    border-[#e8eefc]
    p-7
    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    h-fit
  "
>

  <div className="mb-7">

    <h2 className="
      text-3xl
      font-black
      text-slate-900
    ">
      Registrar producto
    </h2>

    <p className="
      text-slate-400
      mt-2
    ">
      Ingresa los datos principales del producto.
    </p>

  </div>

  <form
    onSubmit={guardarProducto}
    className="space-y-5"
  >

    {/* CODIGO */}

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-slate-500
        mb-3
      ">
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
        placeholder="Ej. PROD001"
        className="
          w-full
          h-14
          rounded-3xl
          border
          border-[#e8eefc]
          bg-[#f8fbff]
          px-5
          outline-none
          focus:ring-2
          focus:ring-emerald-400
        "
      />

    </div>

    {/* NOMBRE */}

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-slate-500
        mb-3
      ">
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
        placeholder="Nombre del producto"
        className="
          w-full
          h-14
          rounded-3xl
          border
          border-[#e8eefc]
          bg-[#f8fbff]
          px-5
          outline-none
          focus:ring-2
          focus:ring-emerald-400
        "
      />

    </div>

    {/* DESCRIPCION */}

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-slate-500
        mb-3
      ">
        Descripción
      </label>

      <textarea
        rows={4}
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
        placeholder="Descripción o uso del producto"
        className="
          w-full
          rounded-3xl
          border
          border-[#e8eefc]
          bg-[#f8fbff]
          p-5
          outline-none
          focus:ring-2
          focus:ring-emerald-400
        "
      />

    </div>

    {/* PRECIO */}

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-slate-500
        mb-3
      ">
        Precio
      </label>

      <input
        type="number"
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
        placeholder="Q0.00"
        className="
          w-full
          h-14
          rounded-3xl
          border
          border-[#e8eefc]
          bg-[#f8fbff]
          px-5
          outline-none
          focus:ring-2
          focus:ring-emerald-400
        "
      />

    </div>

    {/* BOTONES */}

    <div className="
      flex
      items-center
      gap-4
      pt-2
    ">

      <button
        type="submit"
        className="
          h-14
          px-7
          rounded-3xl
          bg-gradient-to-r
          from-emerald-500
          to-cyan-500
          text-white
          font-semibold
          shadow-lg
        "
      >
        Agregar producto
      </button>

      <button
        type="button"
        onClick={() =>
          setProductoActual({
            idProducto: "",
            nombre: "",
            descripcion: "",
            precio: ""
          })
        }
        className="
          h-14
          px-7
          rounded-3xl
          bg-[#f1f5f9]
          text-slate-600
          font-semibold
        "
      >
        Limpiar
      </button>

    </div>

  </form>

</div>

 

  {/* TABLA */}

  <div
    className="
      bg-[#ffffff]
      rounded-[28px]
      border
      border-[#e8eefc]
      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
      overflow-hidden
    "
  >

    {/* HEADER TABLA */}

    <div className="
      p-7
      border-b
      border-[#eef2ff]
      flex
      flex-col
      xl:flex-row
      xl:items-center
      xl:justify-between
      gap-5
    ">

      <div>

        <h2 className="
          text-3xl
          font-black
          text-slate-900
        ">
          Lista de productos
        </h2>

        <p className="
          text-slate-400
          mt-2
        ">
          Productos registrados en el sistema
        </p>

      </div>

      {/* SEARCH */}

      <div className="
        relative
        w-full
        xl:max-w-[380px]
      ">

        <Search
          size={18}
          className="
            absolute
            left-5
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
            rounded-3xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
            pl-14
            pr-5
            outline-none
            text-slate-700
            focus:ring-2
            focus:ring-emerald-400
            transition-all
          "
        />

      </div>

    </div>

    {/* TABLA */}

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-[#f7fafc]">

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
                  producto.idProducto ||
                  producto.id
                }
                className="
                  border-t
                  border-[#eef2ff]
                  hover:bg-[#f8fbff]
                  transition-all
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

                <td className="px-6 py-6 font-bold text-emerald-600">
                  Q
                  {Number(
                    producto.precio || 0
                  ).toFixed(2)}
                </td>

                <td className="px-6 py-6">

                  <div className="flex items-center justify-center gap-3">

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
                        bg-[#ecfeff]
                        text-cyan-600
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        eliminarProducto(
                          producto.idProducto ||
                          producto.id
                        )
                      }
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-[#fff1f2]
                        text-rose-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Trash2 size={18} />
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
               from-emerald-500
to-cyan-500
                px-8
                py-7
                text-white
                flex
                items-center
                justify-between
              "
            >

              <h2 className="text-3xl font-bold">

                {modoEdicion
                  ? "Editar producto"
                  : "Nuevo producto"}

              </h2>

              <button
                onClick={() =>
                  setMostrarModal(false)
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-white/10
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
                    "
                  />

                </div>
              )}

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
                  "
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-3">
                  Descripción
                </label>

                <textarea
                  required
                  rows={4}
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
                  "
                />

              </div>

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
                  "
                />

              </div>

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
                   from-emerald-500
to-cyan-500
                    text-white
                    font-semibold
                    shadow-lg
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