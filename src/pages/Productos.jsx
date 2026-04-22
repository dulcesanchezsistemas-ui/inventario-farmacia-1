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

function Productos() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    precio: ""
  });

  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [searchTemp, setSearchTemp] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("productosCatalogo");

    if (data) {
      dispatch({ type: "SET", payload: JSON.parse(data) });
    } else {
      dispatch({
        type: "SET",
        payload: [
          { id: 1, codigo: "P001", nombre: "Paracetamol", precio: 10 },
          { id: 2, codigo: "P002", nombre: "Ibuprofeno", precio: 15 },
          { id: 3, codigo: "P003", nombre: "Amoxicilina", precio: 25 }
        ]
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productosCatalogo", JSON.stringify(state.productos));
  }, [state.productos]);

  useEffect(() => {
    const t = setTimeout(() => setBusqueda(searchTemp), 300);
    return () => clearTimeout(t);
  }, [searchTemp]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      codigo: "",
      nombre: "",
      precio: ""
    });
    setEditando(null);
  };

  const guardar = () => {
    if (!form.codigo.trim() || !form.nombre.trim() || form.precio === "") {
      alert("Completa todos los campos.");
      return;
    }

    if (Number(form.precio) < 0) {
      alert("El precio no puede ser negativo.");
      return;
    }

    if (editando) {
      dispatch({
        type: "UPDATE",
        payload: {
          ...form,
          id: editando,
          precio: Number(form.precio)
        }
      });
    } else {
      dispatch({
        type: "ADD",
        payload: {
          ...form,
          id: Date.now(),
          precio: Number(form.precio)
        }
      });
    }

    resetForm();
  };

  const editar = (producto) => {
    setForm({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio
    });
    setEditando(producto.id);
  };

  const eliminar = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este producto del catálogo?"
    );
    if (!confirmar) return;

    dispatch({ type: "DELETE", payload: id });
  };

  const productosFiltrados = useMemo(() => {
    return state.productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [state.productos, busqueda]);

  const totalProductos = state.productos.length;
  const precioPromedio =
    totalProductos > 0
      ? (
          state.productos.reduce((acc, p) => acc + Number(p.precio), 0) /
          totalProductos
        ).toFixed(2)
      : 0;

  const productoMasCaro =
    totalProductos > 0
      ? [...state.productos].sort((a, b) => b.precio - a.precio)[0]
      : null;

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
          Catálogo de Productos
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Administra los productos generales del sistema. Cada producto puede
          tener uno o varios lotes asociados.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card
          titulo="Total de productos"
          valor={totalProductos}
          color="bg-gray-800"
        />
        <Card
          titulo="Precio promedio"
          valor={`Q${precioPromedio}`}
          color="bg-blue-600"
        />
        <Card
          titulo="Producto más caro"
          valor={productoMasCaro ? productoMasCaro.nombre : "N/A"}
          color="bg-green-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editando ? "Editar producto" : "Registrar producto"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            name="codigo"
            placeholder="Código del producto"
            value={form.codigo}
            onChange={handleChange}
          />

          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            name="nombre"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={handleChange}
          />

          <input
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={guardar}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
          >
            {editando ? "Actualizar producto" : "Agregar producto"}
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
              Lista de productos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Consulta, busca y administra el catálogo de productos.
            </p>
          </div>

          <div className="w-full xl:w-auto">
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[320px]"
              placeholder="Buscar por código o nombre..."
              value={searchTemp}
              onChange={(e) => setSearchTemp(e.target.value)}
            />
          </div>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No se encontraron productos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Código
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Nombre
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Precio
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-4 text-gray-600">{p.codigo}</td>
                    <td className="p-4 text-gray-800 font-medium">
                      {p.nombre}
                    </td>
                    <td className="p-4 text-gray-600">Q{p.precio}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;