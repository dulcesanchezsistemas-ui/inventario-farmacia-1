import { useEffect, useMemo, useReducer, useState } from "react";

const initialState = {
  lotes: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { lotes: action.payload };
    case "ADD":
      return { lotes: [...state.lotes, action.payload] };
    case "UPDATE":
      return {
        lotes: state.lotes.map((l) =>
          l.id === action.payload.id ? action.payload : l
        )
      };
    case "DELETE":
      return {
        lotes: state.lotes.filter((l) => l.id !== action.payload)
      };
    default:
      return state;
  }
}

function Lotes() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    productoId: "",
    nombreProducto: "",
    codigoLote: "",
    fechaVencimiento: "",
    cantidad: ""
  });

  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [searchTemp, setSearchTemp] = useState("");

  useEffect(() => {
    const dataProductos = localStorage.getItem("productosCatalogo");
    if (dataProductos) {
      setProductos(JSON.parse(dataProductos));
    } else {
      setProductos([]);
    }

    const dataLotes = localStorage.getItem("lotesInventario");
    if (dataLotes) {
      dispatch({ type: "SET", payload: JSON.parse(dataLotes) });
    } else {
      dispatch({
        type: "SET",
        payload: []
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lotesInventario", JSON.stringify(state.lotes));
  }, [state.lotes]);

  useEffect(() => {
    const t = setTimeout(() => {
      setBusqueda(searchTemp);
    }, 300);

    return () => clearTimeout(t);
  }, [searchTemp]);

  const obtenerEstado = (fecha) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    const diff = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";
    if (diff < 30) return "porVencer";
    return "vigente";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productoId") {
      const productoSeleccionado = productos.find(
        (p) => String(p.id) === String(value)
      );

      setForm({
        ...form,
        productoId: value,
        nombreProducto: productoSeleccionado ? productoSeleccionado.nombre : ""
      });
      return;
    }

    setForm({
      ...form,
      [name]: value
    });
  };

  const resetForm = () => {
    setForm({
      productoId: "",
      nombreProducto: "",
      codigoLote: "",
      fechaVencimiento: "",
      cantidad: ""
    });
    setEditando(null);
  };

  const guardar = () => {
    if (
      !form.productoId ||
      !form.codigoLote.trim() ||
      !form.fechaVencimiento ||
      form.cantidad === ""
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (Number(form.cantidad) < 0) {
      alert("La cantidad no puede ser negativa.");
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];

    if (editando) {
      const loteActual = state.lotes.find((l) => l.id === editando);

      dispatch({
        type: "UPDATE",
        payload: {
          ...form,
          id: editando,
          productoId: Number(form.productoId),
          cantidad: Number(form.cantidad),
          fechaIngreso: loteActual?.fechaIngreso || hoy
        }
      });
    } else {
      dispatch({
        type: "ADD",
        payload: {
          ...form,
          id: Date.now(),
          productoId: Number(form.productoId),
          cantidad: Number(form.cantidad),
          fechaIngreso: hoy
        }
      });
    }

    resetForm();
  };

  const editar = (lote) => {
    setForm({
      productoId: lote.productoId,
      nombreProducto: lote.nombreProducto,
      codigoLote: lote.codigoLote,
      fechaVencimiento: lote.fechaVencimiento,
      cantidad: lote.cantidad
    });
    setEditando(lote.id);
  };

  const eliminar = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este lote?"
    );
    if (!confirmar) return;

    dispatch({ type: "DELETE", payload: id });
  };

  const lotesFiltrados = useMemo(() => {
    return state.lotes.filter((lote) => {
      const estado = obtenerEstado(lote.fechaVencimiento);

      const coincideBusqueda =
        lote.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
        lote.codigoLote.toLowerCase().includes(busqueda.toLowerCase());

      const coincideFiltro = filtro === "todos" || filtro === estado;

      return coincideBusqueda && coincideFiltro;
    });
  }, [state.lotes, busqueda, filtro]);

  const stats = useMemo(() => {
    return {
      total: state.lotes.length,
      vigentes: state.lotes.filter(
        (l) => obtenerEstado(l.fechaVencimiento) === "vigente"
      ).length,
      porVencer: state.lotes.filter(
        (l) => obtenerEstado(l.fechaVencimiento) === "porVencer"
      ).length,
      vencidos: state.lotes.filter(
        (l) => obtenerEstado(l.fechaVencimiento) === "vencido"
      ).length
    };
  }, [state.lotes]);

  const Card = ({ titulo, valor, color }) => (
    <div
      className={`rounded-2xl p-4 text-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${color}`}
    >
      <p className="text-sm opacity-90">{titulo}</p>
      <h3 className="text-2xl font-bold mt-2">{valor}</h3>
    </div>
  );

  const fechaHoy = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Lotes</h1>
        <p className="text-sm text-gray-500 mt-2">
          Administra los lotes de cada producto, controla fechas y cantidad
          disponible.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card titulo="Total de lotes" valor={stats.total} color="bg-gray-800" />
        <Card titulo="Lotes vigentes" valor={stats.vigentes} color="bg-green-500" />
        <Card titulo="Por vencer" valor={stats.porVencer} color="bg-orange-500" />
        <Card titulo="Vencidos" valor={stats.vencidos} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editando ? "Editar lote" : "Registrar lote"}
        </h2>

        {productos.length === 0 ? (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-yellow-700 font-medium">
              No hay productos registrados.
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Primero debes agregar productos en el catálogo para poder crear lotes.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Producto
                </label>
                <select
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  name="productoId"
                  value={form.productoId}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Código de lote
                </label>
                <input
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  name="codigoLote"
                  placeholder="Código de lote"
                  value={form.codigoLote}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Cantidad
                </label>
                <input
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="cantidad"
                  placeholder="Cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Fecha de ingreso
                </label>
                <input
                  className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                  value={editando
                    ? state.lotes.find((l) => l.id === editando)?.fechaIngreso || fechaHoy
                    : fechaHoy}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Fecha de vencimiento
                </label>
                <input
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  name="fechaVencimiento"
                  value={form.fechaVencimiento}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Producto seleccionado
                </label>
                <input
                  className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                  value={form.nombreProducto}
                  placeholder="Producto seleccionado"
                  disabled
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              La fecha de ingreso se asigna automáticamente al registrar el lote.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={guardar}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
              >
                {editando ? "Actualizar lote" : "Agregar lote"}
              </button>

              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all text-gray-800 px-5 py-3 rounded-xl font-medium"
              >
                Limpiar
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Lista de lotes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Consulta lotes por producto o código y filtra según su estado.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[280px]"
              placeholder="Buscar por producto o lote..."
              value={searchTemp}
              onChange={(e) => setSearchTemp(e.target.value)}
            />

            <select
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="vigente">Vigentes</option>
              <option value="porVencer">Por vencer</option>
              <option value="vencido">Vencidos</option>
            </select>
          </div>
        </div>

        {lotesFiltrados.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No se encontraron lotes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Producto
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Lote
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Fecha ingreso
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Fecha vencimiento
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Cantidad
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Estado
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {lotesFiltrados.map((lote) => {
                  const estado = obtenerEstado(lote.fechaVencimiento);

                  return (
                    <tr
                      key={lote.id}
                      className="border-t hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-4 text-gray-800 font-medium">
                        {lote.nombreProducto}
                      </td>
                      <td className="p-4 text-gray-600">{lote.codigoLote}</td>
                      <td className="p-4 text-gray-600">{lote.fechaIngreso}</td>
                      <td className="p-4 text-gray-600">{lote.fechaVencimiento}</td>
                      <td className="p-4 text-gray-600">{lote.cantidad}</td>
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
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => editar(lote)}
                            className="bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all px-3 py-2 rounded-lg text-sm font-medium text-gray-900"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminar(lote.id)}
                            className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white px-3 py-2 rounded-lg text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
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
  );
}

export default Lotes;