import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Boxes,
  Save,
  X,
  Pencil,
  Trash2,
  Search,
  CalendarDays,
  PackageCheck,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Lotes({ setVista }) {
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [modoEdicion, setModoEdicion] = useState(false);

  const [idEditar, setIdEditar] = useState(null);

  const [formulario, setFormulario] = useState({
    codigoLote: "",
    idProducto: "",
    cantidad: "",
    fechaIngreso: "",
    fechaVencimiento: ""
  });

  useEffect(() => {
    cargarLotes();
    cargarProductos();
  }, []);

  const cargarLotes = async () => {
    try {
      const res = await fetch(`${API_URL}/lotes`);

      const data = await res.json();

      setLotes(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar lotes");
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);

      const data = await res.json();

      setProductos(data);
    } catch (error) {
      console.error(error);
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
      codigoLote: "",
      idProducto: "",
      cantidad: "",
      fechaIngreso: "",
      fechaVencimiento: ""
    });

    setModoEdicion(false);

    setIdEditar(null);
  };

  const guardarLote = async () => {
    try {
      const metodo = modoEdicion ? "PUT" : "POST";

      const url = modoEdicion
        ? `${API_URL}/lotes/${idEditar}`
        : `${API_URL}/lotes`;

      await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario)
      });

      cargarLotes();

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar lote");
    }
  };

  const editarLote = (lote) => {
    setFormulario({
      codigoLote: lote.codigoLote,
      idProducto: lote.idProducto,
      cantidad: lote.cantidad,
      fechaIngreso: lote.fechaIngreso?.split("T")[0],
      fechaVencimiento: lote.fechaVencimiento?.split("T")[0]
    });

    setIdEditar(lote.codigoLote);

    setModoEdicion(true);
  };

  const eliminarLote = async (id) => {
    try {
      await fetch(`${API_URL}/lotes/${id}`, {
        method: "DELETE"
      });

      cargarLotes();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar lote");
    }
  };

  const obtenerEstado = (fecha) => {
    const hoy = new Date();

    const vencimiento = new Date(fecha);

    const diff =
      (vencimiento - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";

    if (diff <= 30) return "por vencer";

    return "vigente";
  };

  const lotesFiltrados = useMemo(() => {
    return lotes.filter((l) =>
      `${l.codigoLote} ${l.nombreProducto}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [lotes, busqueda]);

  const estadisticas = useMemo(() => {
    return {
      total: lotes.length,

      vigentes: lotes.filter(
        (l) =>
          obtenerEstado(l.fechaVencimiento) ===
          "vigente"
      ).length,

      porVencer: lotes.filter(
        (l) =>
          obtenerEstado(l.fechaVencimiento) ===
          "por vencer"
      ).length,

      vencidos: lotes.filter(
        (l) =>
          obtenerEstado(l.fechaVencimiento) ===
          "vencido"
      ).length
    };
  }, [lotes]);

  const BadgeEstado = ({ estado }) => {
    if (estado === "vigente") {
      return (
        <span
          className="
            px-4
            py-2
            rounded-2xl
            bg-green-100
            text-green-700
            text-sm
            font-medium
          "
        >
          Vigente
        </span>
      );
    }

    if (estado === "por vencer") {
      return (
        <span
          className="
            px-4
            py-2
            rounded-2xl
            bg-yellow-100
            text-yellow-700
            text-sm
            font-medium
          "
        >
          Por vencer
        </span>
      );
    }

    return (
      <span
        className="
          px-4
          py-2
          rounded-2xl
          bg-red-100
          text-red-700
          text-sm
          font-medium
        "
      >
        Vencido
      </span>
    );
  };

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
              Lotes
            </h1>

            <p className="text-slate-400 mt-2">
              Control de inventario y vencimientos
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

          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Boxes
              size={22}
              className="text-violet-700"
            />
          </div>

          <div>

            <p className="text-sm text-slate-400">
              Total lotes
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              {estadisticas.total}
            </h3>

          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Vigentes
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-4">
                {estadisticas.vigentes}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <PackageCheck
                size={26}
                className="text-green-700"
              />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Por vencer
              </p>

              <h2 className="text-4xl font-bold text-yellow-600 mt-4">
                {estadisticas.porVencer}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <AlertTriangle
                size={26}
                className="text-yellow-700"
              />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Vencidos
              </p>

              <h2 className="text-4xl font-bold text-red-600 mt-4">
                {estadisticas.vencidos}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <ShieldAlert
                size={26}
                className="text-red-700"
              />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Inventario
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-4">
                {estadisticas.total}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <CalendarDays
                size={26}
                className="text-blue-700"
              />
            </div>

          </div>

        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {modoEdicion
                ? "Editar lote"
                : "Nuevo lote"}
            </h2>

            <p className="text-slate-400 mt-2">
              Gestiona los registros de inventario.
            </p>

          </div>

          <div className="w-14 h-14 rounded-3xl bg-violet-100 flex items-center justify-center">
            <Boxes
              size={26}
              className="text-violet-700"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

          <input
            type="text"
            name="codigoLote"
            placeholder="Código lote"
            value={formulario.codigoLote}
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

          <select
            name="idProducto"
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
          >
            <option value="">
              Seleccionar producto
            </option>

            {productos.map((producto) => (
              <option
                key={producto.idProducto}
                value={producto.idProducto}
              >
                {producto.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={formulario.cantidad}
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
            type="date"
            name="fechaIngreso"
            value={formulario.fechaIngreso}
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
            type="date"
            name="fechaVencimiento"
            value={formulario.fechaVencimiento}
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
            onClick={guardarLote}
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
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Inventario
              </h2>

              <p className="text-slate-400 mt-2">
                Control general de lotes registrados.
              </p>

            </div>

            <div className="relative w-full xl:w-[320px]">

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
                  Lote
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Producto
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Cantidad
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Ingreso
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Vencimiento
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Estado
                </th>

                <th className="text-center px-6 py-5 text-sm font-semibold text-slate-500">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {lotesFiltrados.map((lote) => {
                const estado = obtenerEstado(
                  lote.fechaVencimiento
                );

                return (
                  <tr
                    key={lote.codigoLote}
                    className="
                      border-t
                      border-gray-100
                      hover:bg-slate-50
                      transition-all
                    "
                  >

                    <td className="px-6 py-5 font-medium text-slate-700">
                      {lote.codigoLote}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {lote.nombreProducto}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {lote.cantidad}
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {lote.fechaIngreso?.split("T")[0]}
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {lote.fechaVencimiento?.split("T")[0]}
                    </td>

                    <td className="px-6 py-5">
                      <BadgeEstado estado={estado} />
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            editarLote(lote)
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
                            eliminarLote(
                              lote.codigoLote
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