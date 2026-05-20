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
      cantidad: ""
    });

  // =========================
  // CARGAR LOTES
  // =========================
  useEffect(() => {
    cargarLotes();
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

  // =========================
  // NUEVO LOTE
  // =========================
  const abrirNuevoLote = () => {

    setModoEdicion(false);

    setLoteActual({
      idLote: "",
      idProducto: "",
      cantidad: ""
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
              )

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
            "
          >
            <ArrowLeft
              size={20}
              className="text-slate-700"
            />
          </button>

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Lotes
            </h1>

            <p className="text-slate-400 mt-2">
              Gestión de inventario
            </p>

          </div>

        </div>

        <button
          onClick={
            abrirNuevoLote
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
          "
        >

          <Plus size={20} />

          Nuevo lote

        </button>

      </div>

      {/* SEARCH */}
      <div
        className="
          bg-white
          rounded-[32px]
          border
          border-gray-100
          p-6
          shadow-sm
        "
      >

        <div className="relative">

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
            placeholder="Buscar lote..."
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

      {/* TABLA */}
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
                  ID Lote
                </th>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Producto
                </th>

                <th className="px-6 py-5 text-left text-sm font-semibold text-slate-500">
                  Cantidad
                </th>

                <th className="px-6 py-5 text-center text-sm font-semibold text-slate-500">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {lotesFiltrados.map(
                (lote) => (

                  <tr
                    key={
                      lote.idLote
                    }
                    className="
                      border-t
                      border-gray-100
                      hover:bg-slate-50
                    "
                  >

                    <td className="px-6 py-6 font-semibold text-slate-700">
                      {lote.idLote}
                    </td>

                    <td className="px-6 py-6 text-slate-700">
                      {lote.idProducto}
                    </td>

                    <td className="px-6 py-6 font-bold text-slate-900">
                      {lote.cantidad}
                    </td>

                    <td className="px-6 py-6">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            abrirEditarLote(
                              lote
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
                            w-12
                            h-12
                            rounded-2xl
                            bg-red-100
                            text-red-700
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
                    ID Producto
                  </label>

                  <input
                    type="text"
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
                  />

                </div>
              )}

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