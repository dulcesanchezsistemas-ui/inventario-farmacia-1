import { useEffect, useMemo, useReducer, useState } from "react";

const initialState = {
  ventas: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ventas: action.payload };
    case "ADD":
      return { ventas: [...state.ventas, action.payload] };
    case "DELETE":
      return {
        ventas: state.ventas.filter((v) => v.id !== action.payload)
      };
    default:
      return state;
  }
}

function VentaProducto() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);

  const [form, setForm] = useState({
    productoId: "",
    nombreProducto: "",
    loteId: "",
    codigoLote: "",
    cantidadVendida: ""
  });

  const [searchTemp, setSearchTemp] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const dataProductos = localStorage.getItem("productosCatalogo");
    const dataLotes = localStorage.getItem("lotesInventario");
    const dataVentas = localStorage.getItem("ventasProductos");

    if (dataProductos) {
      setProductos(JSON.parse(dataProductos));
    } else {
      setProductos([]);
    }

    if (dataLotes) {
      setLotes(JSON.parse(dataLotes));
    } else {
      setLotes([]);
    }

    if (dataVentas) {
      dispatch({ type: "SET", payload: JSON.parse(dataVentas) });
    } else {
      dispatch({
        type: "SET",
        payload: []
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ventasProductos", JSON.stringify(state.ventas));
  }, [state.ventas]);

  useEffect(() => {
    const t = setTimeout(() => {
      setBusqueda(searchTemp);
    }, 300);

    return () => clearTimeout(t);
  }, [searchTemp]);

  const lotesDisponibles = useMemo(() => {
    if (!form.productoId) return [];

    return lotes.filter(
      (lote) =>
        String(lote.productoId) === String(form.productoId) &&
        Number(lote.cantidad) > 0
    );
  }, [lotes, form.productoId]);

  const loteSeleccionado = useMemo(() => {
    if (!form.loteId) return null;

    return lotes.find((l) => String(l.id) === String(form.loteId)) || null;
  }, [lotes, form.loteId]);

  const totalVentas = state.ventas.length;

  const totalUnidadesVendidas = state.ventas.reduce(
    (acc, venta) => acc + Number(venta.cantidadVendida),
    0
  );

  const productoMasVendido = useMemo(() => {
    if (state.ventas.length === 0) return null;

    const conteo = {};

    state.ventas.forEach((venta) => {
      if (!conteo[venta.nombreProducto]) {
        conteo[venta.nombreProducto] = 0;
      }
      conteo[venta.nombreProducto] += Number(venta.cantidadVendida);
    });

    const nombre = Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );

    return nombre;
  }, [state.ventas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productoId") {
      const productoSeleccionado = productos.find(
        (p) => String(p.id) === String(value)
      );

      setForm({
        productoId: value,
        nombreProducto: productoSeleccionado ? productoSeleccionado.nombre : "",
        loteId: "",
        codigoLote: "",
        cantidadVendida: ""
      });
      return;
    }

    if (name === "loteId") {
      const lote = lotes.find((l) => String(l.id) === String(value));

      setForm({
        ...form,
        loteId: value,
        codigoLote: lote ? lote.codigoLote : ""
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
      loteId: "",
      codigoLote: "",
      cantidadVendida: ""
    });
  };

  const registrarVenta = () => {
    if (!form.productoId || !form.loteId || !form.cantidadVendida) {
      alert("Completa todos los campos.");
      return;
    }

    const cantidad = Number(form.cantidadVendida);

    if (cantidad <= 0) {
      alert("La cantidad vendida debe ser mayor que cero.");
      return;
    }

    if (!loteSeleccionado) {
      alert("Debes seleccionar un lote válido.");
      return;
    }

    if (cantidad > Number(loteSeleccionado.cantidad)) {
      alert("La cantidad vendida supera la cantidad disponible del lote.");
      return;
    }

    const nuevasVentas = [
      ...state.ventas,
      {
        id: Date.now(),
        productoId: Number(form.productoId),
        nombreProducto: form.nombreProducto,
        loteId: Number(form.loteId),
        codigoLote: form.codigoLote,
        cantidadVendida: cantidad
      }
    ];

    const lotesActualizados = lotes.map((lote) =>
      String(lote.id) === String(form.loteId)
        ? {
            ...lote,
            cantidad: Number(lote.cantidad) - cantidad
          }
        : lote
    );

    dispatch({
      type: "SET",
      payload: nuevasVentas
    });

    setLotes(lotesActualizados);
    localStorage.setItem("lotesInventario", JSON.stringify(lotesActualizados));

    resetForm();
  };

  const eliminarVenta = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este registro de venta?"
    );
    if (!confirmar) return;

    const venta = state.ventas.find((v) => v.id === id);
    if (!venta) return;

    const lotesActualizados = lotes.map((lote) =>
      lote.id === venta.loteId
        ? {
            ...lote,
            cantidad: Number(lote.cantidad) + Number(venta.cantidadVendida)
          }
        : lote
    );

    const nuevasVentas = state.ventas.filter((v) => v.id !== id);

    dispatch({
      type: "SET",
      payload: nuevasVentas
    });

    setLotes(lotesActualizados);
    localStorage.setItem("lotesInventario", JSON.stringify(lotesActualizados));
  };

  const ventasFiltradas = useMemo(() => {
    return state.ventas.filter(
      (venta) =>
        venta.nombreProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
        venta.codigoLote.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [state.ventas, busqueda]);

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
          Venta de Producto
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Registra ventas seleccionando un producto y el lote desde el cual se
          descontará la cantidad vendida.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card
          titulo="Total de ventas"
          valor={totalVentas}
          color="bg-gray-800"
        />
        <Card
          titulo="Unidades vendidas"
          valor={totalUnidadesVendidas}
          color="bg-blue-600"
        />
        <Card
          titulo="Producto más vendido"
          valor={productoMasVendido || "N/A"}
          color="bg-green-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registrar venta
        </h2>

        {productos.length === 0 ? (
          <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-yellow-700 font-medium">
              No hay productos registrados.
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Primero debes crear productos en el catálogo.
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
                  Lote
                </label>
                <select
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  name="loteId"
                  value={form.loteId}
                  onChange={handleChange}
                  disabled={!form.productoId}
                >
                  <option value="">Selecciona un lote</option>
                  {lotesDisponibles.map((lote) => (
                    <option key={lote.id} value={lote.id}>
                      {lote.codigoLote}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Cantidad disponible
                </label>
                <input
                  className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                  value={
                    loteSeleccionado
                      ? `Disponible: ${loteSeleccionado.cantidad}`
                      : ""
                  }
                  placeholder="Cantidad disponible"
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Cantidad a vender
                </label>
                <input
                  className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="cantidadVendida"
                  placeholder="Cantidad a vender"
                  value={form.cantidadVendida}
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

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={registrarVenta}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
              >
                Registrar venta
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
              Historial de ventas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Consulta las ventas registradas por producto y lote.
            </p>
          </div>

          <div className="w-full xl:w-auto">
            <input
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[320px]"
              placeholder="Buscar por producto o lote..."
              value={searchTemp}
              onChange={(e) => setSearchTemp(e.target.value)}
            />
          </div>
        </div>

        {ventasFiltradas.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No hay ventas registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Producto
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Lote
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Cantidad vendida
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr
                    key={venta.id}
                    className="border-t hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-4 text-gray-800 font-medium">
                      {venta.nombreProducto}
                    </td>
                    <td className="p-4 text-gray-600">{venta.codigoLote}</td>
                    <td className="p-4 text-gray-600">
                      {venta.cantidadVendida}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => eliminarVenta(venta.id)}
                        className="bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        Eliminar
                      </button>
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

export default VentaProducto;