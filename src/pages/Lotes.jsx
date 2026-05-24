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

function Lotes({ setVista }) {

  const [lotes, setLotes] =
    useState([]);
  const [productos, setProductos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [loteActual, setLoteActual] =
  useState({
    idLote: "",
    idProducto: "",
    cantidad: "",
    fechaIngreso: "",
    fechaVencimiento: ""
  });

  // =========================
  // CARGAR LOTES
  // =========================
  useEffect(() => {

  cargarLotes();

  cargarProductos();

}, []);

  const cargarLotes = async () => {

    try {

      const res = await fetch(
        `${API_URL}/lotes`
      );

      if (!res.ok) {
        throw new Error(
          "Error al cargar lotes"
        );
      }

      const data = await res.json();

      setLotes(
        Array.isArray(data)
          ? data
          : data.lotes || []
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error al cargar lotes"
      );
    }
  };
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
  }
};
  // =========================
  // NUEVO LOTE
  // =========================
  const abrirNuevoLote = () => {

    setModoEdicion(false);

    setLoteActual({
  idLote: "",
  idProducto: "",
  cantidad: "",
  fechaIngreso:
    new Date()
      .toISOString()
      .split("T")[0],
  fechaVencimiento: ""
});

    setMostrarModal(true);
  };

  // =========================
  // EDITAR LOTE
  // =========================
  const abrirEditarLote = (
    lote
  ) => {

    setModoEdicion(true);

    setLoteActual({

      idLote:
        lote.idLote || "",

      idProducto:
        lote.idProducto || "",

      cantidad:
        lote.cantidad || ""

    });

    setMostrarModal(true);
  };

  // =========================
  // GUARDAR LOTE
  // =========================
  const guardarLote = async (
    e
  ) => {

    e.preventDefault();

    try {

      if (
        !loteActual.idLote ||
        !loteActual.idProducto ||
        loteActual.cantidad === ""
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
          `${API_URL}/lotes/${loteActual.idLote}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              idLote:
                loteActual.idLote,

              cantidad: Number(
                loteActual.cantidad
              )

            })
          }
        );

        if (!res.ok) {
          throw new Error(
            "Error al actualizar lote"
          );
        }

        alert(
          "Lote actualizado"
        );
      }

      // =====================
      // CREAR
      // =====================
      else {

        const res = await fetch(
          `${API_URL}/lotes`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

  idLote:
    loteActual.idLote,

  idProducto:
    loteActual.idProducto,

  cantidad: Number(
    loteActual.cantidad
  ),

  fechaIngreso:
    loteActual.fechaIngreso,

  fechaVencimiento:
    loteActual.fechaVencimiento

})
          }
        );

        if (!res.ok) {
          throw new Error(
            "Error al crear lote"
          );
        }

        alert(
          "Lote creado"
        );
      }

      setMostrarModal(false);

      cargarLotes();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Error al guardar lote"
      );
    }
  };

  // =========================
  // ELIMINAR LOTE
  // =========================
  const eliminarLote = async (
    idLote
  ) => {

    const confirmar = confirm(
      "¿Deseas eliminar este lote?"
    );

    if (!confirmar) return;

    try {

      const res = await fetch(
        `${API_URL}/lotes/${idLote}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error al eliminar lote"
        );
      }

      alert(
        "Lote eliminado"
      );

      cargarLotes();

    } catch (error) {

      console.error(error);

      alert(
        "Error al eliminar lote"
      );
    }
  };

  // =========================
  // FILTRAR LOTES
  // =========================
  const lotesFiltrados =
    useMemo(() => {

      return lotes.filter(
        (lote) =>
          `${lote.idLote || ""} ${
            lote.idProducto || ""
          }`
            .toLowerCase()
            .includes(
              busqueda.toLowerCase()
            )
      );

    }, [lotes, busqueda]);

  return (

    <div className="space-y-8">
      {/* RESUMEN SUPERIOR */}

<div
  className="
    bg-[#ffffff]
    border
    border-[#e8eefc]
    rounded-[28px]
    p-6
    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
  "
>

  <div className="
    flex
    flex-col
    xl:flex-row
    xl:items-center
    xl:justify-between
    gap-6
  ">

    {/* LEFT */}
    <div>

      <h1 className="
        text-3xl
        font-black
        text-slate-900
      ">
        Gestión de lotes
      </h1>

      <p className="
        text-slate-500
        mt-2
      ">
        Controla vencimientos,
        stock y productos registrados.
      </p>

    </div>

    {/* RIGHT */}
    <div className="
      flex
      items-center
      gap-4
      flex-wrap
    ">

      {/* TOTAL */}
      <div className="
        bg-[#f7fafc]
        border
        border-[#e8eefc]
        rounded-3xl
        px-5
        py-4
        min-w-[150px]
      ">

        <p className="
          text-sm
          text-slate-400
        ">
          Total lotes
        </p>

        <h2 className="
          text-2xl
          font-black
          text-emerald-600
          mt-1
        ">
          {lotes.length}
        </h2>

      </div>

      {/* VENCIDOS */}
      <div className="
        bg-[#fff1f2]
        border
        border-[#ffe4e6]
        rounded-3xl
        px-5
        py-4
        min-w-[150px]
      ">

        <p className="
          text-sm
          text-red-400
        ">
          Vencidos
        </p>

        <h2 className="
          text-2xl
          font-black
          text-red-500
          mt-1
        ">
          {
            lotes.filter((l) => {

              if (!l.fechaVencimiento)
                return false;

              return (
                new Date(
                  l.fechaVencimiento
                ) < new Date()
              );

            }).length
          }
        </h2>

      </div>

      {/* STOCK */}
      <div className="
        bg-[#fff7ed]
        border
        border-[#ffedd5]
        rounded-3xl
        px-5
        py-4
        min-w-[150px]
      ">

        <p className="
          text-sm
          text-orange-400
        ">
          Stock bajo
        </p>

        <h2 className="
          text-2xl
          font-black
          text-orange-500
          mt-1
        ">
          {
            lotes.filter(
              (l) =>
                Number(l.cantidad) <= 5
            ).length
          }
        </h2>

      </div>

    </div>

  </div>

</div>

      {/* HEADER */}

<div
  className="
    flex
    flex-col
    xl:flex-row
    xl:items-center
    xl:justify-between
    gap-6
  "
>

  {/* LEFT */}
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
        hover:scale-105
        transition-all
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
        Lotes
      </h1>

      <p className="
        text-slate-400
        mt-2
      ">
        Administración de inventario farmacéutico
      </p>

    </div>

  </div>

  {/* RIGHT */}
  <button
    onClick={
      abrirNuevoLote
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
      justify-center
      gap-3
      shadow-lg
      hover:scale-[1.02]
      transition-all
    "
  >

    <Plus size={20} />

    Registrar lote

  </button>

</div>

     {/* GRID PRINCIPAL */}

<div className="
  grid
  grid-cols-1
  xl:grid-cols-3
  gap-6
">

  {/* REGISTRAR LOTE */}
  <div
    className="
      bg-[#ffffff]
      rounded-[28px]
      border
      border-[#e8eefc]
      p-7
      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    "
  >

    <div className="mb-8">

      <h2 className="
        text-2xl
        font-black
        text-slate-900
      ">
        Registrar lote
      </h2>

      <p className="
        text-slate-400
        mt-2
      ">
        Agrega existencias por producto.
      </p>

    </div>

    <form
      onSubmit={guardarLote}
      className="space-y-5"
    >

      {/* ID */}
      <div>

        <label className="
          text-sm
          font-semibold
          text-slate-500
          block
          mb-3
        ">
          Código de lote
        </label>

        <input
          type="text"
          required
          value={loteActual.idLote}
          onChange={(e) =>
            setLoteActual({
              ...loteActual,
              idLote: e.target.value
            })
          }
          placeholder="Ej. LOT001"
          className="
            w-full
            h-14
            rounded-2xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
            px-5
            outline-none
            focus:ring-2
            focus:ring-emerald-400
          "
        />

      </div>

      {/* PRODUCTO */}
      <div>

        <label className="
          text-sm
          font-semibold
          text-slate-500
          block
          mb-3
        ">
          Producto
        </label>

        <select
          required
          value={loteActual.idProducto}
          onChange={(e) =>
            setLoteActual({
              ...loteActual,
              idProducto:
                e.target.value
            })
          }
          className="
            w-full
            h-14
            rounded-2xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
            px-5
            outline-none
          "
        >

          <option value="">
            Selecciona producto
          </option>

          {productos.map((producto) => (

            <option
              key={
                producto.idProducto ||
                producto.id
              }
              value={
                producto.idProducto ||
                producto.id
              }
            >

              {producto.nombre}

            </option>

          ))}

        </select>

      </div>

      {/* CANTIDAD */}
      <div>

        <label className="
          text-sm
          font-semibold
          text-slate-500
          block
          mb-3
        ">
          Cantidad
        </label>

        <input
          type="number"
          required
          value={loteActual.cantidad}
          onChange={(e) =>
            setLoteActual({
              ...loteActual,
              cantidad:
                e.target.value
            })
          }
          placeholder="Cantidad disponible"
          className="
            w-full
            h-14
            rounded-2xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
            px-5
            outline-none
            focus:ring-2
            focus:ring-emerald-400
          "
        />

      </div>

      {/* FECHA */}
      <div>

        <label className="
          text-sm
          font-semibold
          text-slate-500
          block
          mb-3
        ">
          Fecha de vencimiento
        </label>

        <input
          type="date"
          required
          value={
            loteActual.fechaVencimiento
          }
          onChange={(e) =>
            setLoteActual({
              ...loteActual,
              fechaVencimiento:
                e.target.value
            })
          }
          className="
            w-full
            h-14
            rounded-2xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
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
        pt-4
      ">

        <button
          type="submit"
          className="
            h-14
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-emerald-500
            to-cyan-500
            text-white
            font-semibold
            shadow-lg
          "
        >
          Agregar lote
        </button>

        <button
          type="button"
          onClick={() =>
            setLoteActual({
              idLote: "",
              idProducto: "",
              cantidad: "",
              fechaIngreso: "",
              fechaVencimiento: ""
            })
          }
          className="
            h-14
            px-6
            rounded-2xl
            bg-slate-100
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
      xl:col-span-2
      bg-[#ffffff]
      rounded-[28px]
      border
      border-[#e8eefc]
      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
      overflow-hidden
    "
  >

    {/* HEADER */}
    <div className="
      p-6
      border-b
      border-[#eef2ff]
      flex
      items-center
      justify-between
      gap-4
      flex-wrap
    ">

      <div>

        <h2 className="
          text-2xl
          font-black
          text-slate-900
        ">
          Lista de lotes
        </h2>

        <p className="
          text-slate-400
          mt-2
        ">
          Lotes registrados en la base de datos.
        </p>

      </div>

      {/* SEARCH */}
      <div className="
        relative
        w-full
        xl:w-[320px]
      ">

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
          placeholder="Buscar lote o producto..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
          className="
            w-full
            h-12
            rounded-2xl
            bg-[#f7fafc]
            border
            border-[#e8eefc]
            pl-12
            pr-5
            outline-none
          "
        />

      </div>

    </div>

    {/* TABLA */}
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-[#f7fafc]">

          <tr>

            <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">
              Lote
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">
              Producto
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">
              Cantidad
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">
              Vencimiento
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold text-slate-400">
              Estado
            </th>

            <th className="px-6 py-5 text-center text-sm font-semibold text-slate-400">
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {lotesFiltrados.map((lote) => (

            <tr
              key={lote.idLote}
              className="
                border-t
                border-[#eef2ff]
                hover:bg-[#f8fbff]
                transition-all
              "
            >

              <td className="px-6 py-5 font-semibold text-cyan-600">
                {lote.idLote}
              </td>

              <td className="px-6 py-5 text-slate-700">
                {lote.idProducto}
              </td>

              <td className="px-6 py-5 font-semibold text-slate-700">
                {lote.cantidad}
              </td>

              <td className="px-6 py-5 text-slate-500">
                {lote.fechaVencimiento}
              </td>

              <td className="px-6 py-5">

                {new Date(
                  lote.fechaVencimiento
                ) < new Date() ? (

                  <span className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-[#fff1f2]
                    text-red-500
                    text-sm
                    font-semibold
                  ">
                    Vencido
                  </span>

                ) : (

                  <span className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-[#ecfdf5]
                    text-emerald-600
                    text-sm
                    font-semibold
                  ">
                    Vigente
                  </span>

                )}

              </td>

              <td className="px-6 py-5">

                <div className="
                  flex
                  items-center
                  justify-center
                  gap-3
                ">

                  <button
                    onClick={() =>
                      abrirEditarLote(
                        lote
                      )
                    }
                    className="
                      w-11
                      h-11
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
                      eliminarLote(
                        lote.idLote
                      )
                    }
                    className="
                      w-11
                      h-11
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

          ))}

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

              <h2 className="text-3xl font-bold">

                {modoEdicion
                  ? "Editar lote"
                  : "Nuevo lote"}

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
              onSubmit={guardarLote}
              className="p-8 space-y-6"
            >

              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-3">
                  ID Lote
                </label>

                <input
                  type="text"
                  required
                  disabled={modoEdicion}
                  value={
                    loteActual.idLote
                  }
                  onChange={(e) =>
                    setLoteActual({
                      ...loteActual,
                      idLote:
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

              {!modoEdicion && (

                <div>

  <label className="block text-sm font-semibold text-slate-600 mb-3">
    Producto
  </label>

  <select
    required
    value={
      loteActual.idProducto
    }
    onChange={(e) =>
      setLoteActual({
        ...loteActual,
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
  >

    <option value="">
      Seleccionar producto
    </option>

    {productos.map((producto) => (

      <option
        key={
          producto.idProducto ||
          producto.id
        }
        value={
          producto.idProducto ||
          producto.id
        }
      >

        {producto.nombre}

      </option>

    ))}

  </select>

</div>
              )}
<div>

  <label className="block text-sm font-semibold text-slate-600 mb-3">
    Fecha vencimiento
  </label>

  <input
    type="date"
    required
    value={
      loteActual.fechaVencimiento
    }
    onChange={(e) =>
      setLoteActual({
        ...loteActual,
        fechaVencimiento:
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
                  Cantidad
                </label>

                <input
                  type="number"
                  required
                  value={
                    loteActual.cantidad
                  }
                  onChange={(e) =>
                    setLoteActual({
                      ...loteActual,
                      cantidad:
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
                    from-violet-600
                    to-blue-600
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

export default Lotes;