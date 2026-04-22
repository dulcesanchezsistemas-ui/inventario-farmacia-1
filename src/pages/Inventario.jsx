import { useEffect, useMemo, useReducer, useState } from "react";

const initialState = {
  productos: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { productos: action.payload };

    case "ADD":
      return { productos: [...state.productos, action.payload] };

    case "UPDATE":
      return {
        productos: state.productos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        )
      };

    case "DELETE":
      return {
        productos: state.productos.filter((p) => p.id !== action.payload)
      };

    default:
      return state;
  }
}

function Inventario() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [form, setForm] = useState({
    nombre: "",
    lote: "",
    fechaCaducidad: "",
    stock: ""
  });

  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [searchTemp, setSearchTemp] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("inventario");

    if (data) {
      dispatch({ type: "SET", payload: JSON.parse(data) });
    } else {
      dispatch({
        type: "SET",
        payload: [
          {
            id: 1,
            nombre: "Paracetamol",
            lote: "A123",
            fechaCaducidad: "2026-05-10",
            stock: 50
          },
          {
            id: 2,
            nombre: "Ibuprofeno",
            lote: "B456",
            fechaCaducidad: "2025-01-15",
            stock: 20
          },
          {
            id: 3,
            nombre: "Amoxicilina",
            lote: "C789",
            fechaCaducidad: "2026-04-25",
            stock: 8
          }
        ]
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventario", JSON.stringify(state.productos));
  }, [state.productos]);

  useEffect(() => {
    const t = setTimeout(() => {
      setBusqueda(searchTemp);
    }, 300);

    return () => clearTimeout(t);
  }, [searchTemp]);

  const estadoProducto = (fecha) => {
    const hoy = new Date();
    const cad = new Date(fecha);
    const diff = (cad - hoy) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "vencido";
    if (diff < 30) return "porVencer";
    return "vigente";
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      lote: "",
      fechaCaducidad: "",
      stock: ""
    });
    setEditando(null);
  };

  const guardar = () => {
    if (
      !form.nombre.trim() ||
      !form.lote.trim() ||
      !form.fechaCaducidad ||
      form.stock === ""
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (editando) {
      dispatch({
        type: "UPDATE",
        payload: {
          ...form,
          id: editando,
          stock: Number(form.stock)
        }
      });
    } else {
      dispatch({
        type: "ADD",
        payload: {
          ...form,
          id: Date.now(),
          stock: Number(form.stock)
        }
      });
    }

    resetForm();
  };

  const eliminar = (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este lote?");
    if (!confirmar) return;

    dispatch({ type: "DELETE", payload: id });
  };

  const editar = (producto) => {
    setForm({
      nombre: producto.nombre,
      lote: producto.lote,
      fechaCaducidad: producto.fechaCaducidad,
      stock: producto.stock
    });
    setEditando(producto.id);
  };

  const productosFiltrados = useMemo(() => {
    return state.productos.filter((p) => {
      const estado = estadoProducto(p.fechaCaducidad);

      const coincideBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.lote.toLowerCase().includes(busqueda.toLowerCase());

      const coincideFiltro = filtro === "todos" || filtro === estado;

      return coincideBusqueda && coincideFiltro;
    });
  }, [state.productos, busqueda, filtro]);

  const stats = useMemo(() => {
    return {
      total: state.productos.length,
      vencidos: state.productos.filter(
        (p) => estadoProducto(p.fechaCaducidad) === "vencido"
      ).length,
      porVencer: state.productos.filter(
        (p) => estadoProducto(p.fechaCaducidad) === "porVencer"
      ).length,
      vigentes: state.productos.filter(
        (p) => estadoProducto(p.fechaCaducidad) === "vigente"
      ).length
    };
  }, [state.productos]);

  const Card = ({ titulo, valor, color }) => (
    <div
      className={`rounded-2xl p-4 text-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${color}`}
    >
      <p className="text-sm opacity-90">{titulo}</p>
      <h3 className="text-2xl font-bold mt-2">{valor}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Inventario por Lotes
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Administra los lotes de medicamentos, controla fechas de vencimiento y
          la cantidad disponible por lote.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card titulo="Total de lotes" valor={stats.total} color="bg-gray-800" />
        <Card titulo="Lotes vigentes" valor={stats.vigentes} color="bg-green-500" />
        <Card titulo="Lotes por vencer" valor={stats.porVencer} color="bg-orange-500" />
        <Card titulo="Lotes vencidos" valor={stats.vencidos} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editando ? "Editar lote" : "Registrar lote"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            name="nombre"
            placeholder="Nombre del medicamento"
            value={form.nombre}
            onChange={handleChange}
          />

          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            name="lote"
            placeholder="Código de lote"
            value={form.lote}
            onChange={handleChange}
          />

          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            type="date"
            name="fechaCaducidad"
            value={form.fechaCaducidad}
            onChange={handleChange}
          />

          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="stock"
            placeholder="Cantidad del lote"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Lotes en inventario
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Busca lotes por medicamento o código y filtra según su estado.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[280px]"
              placeholder="Buscar por medicamento o lote..."
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

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No se encontraron lotes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Medicamento
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Lote
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Vencimiento
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
                {productosFiltrados.map((p) => {
                  const estado = estadoProducto(p.fechaCaducidad);

                  return (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-4 text-gray-800 font-medium">{p.nombre}</td>
                      <td className="p-4 text-gray-600">{p.lote}</td>
                      <td className="p-4 text-gray-600">{p.fechaCaducidad}</td>
                      <td className="p-4 text-gray-600">{p.stock}</td>
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
                            onClick={() => editar(p)}
                            className="bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-all px-3 py-2 rounded-lg text-sm font-medium text-gray-900"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => eliminar(p.id)}
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

export default Inventario;