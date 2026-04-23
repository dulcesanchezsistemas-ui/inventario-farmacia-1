import { useEffect, useMemo, useReducer, useState } from "react";

const initialState = {
  ventas: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return { ventas: action.payload };
    case "ADD_MANY":
      return { ventas: [...state.ventas, ...action.payload] };
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
      dispatch({ type: "SET", payload: [] });
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

    return Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );
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
        cantidadVendida: ""
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
      cantidadVendida: ""
    });
  };

  const obtenerLotesOrdenados = (productoId) => {
    return lotes
      .filter(
        (lote) =>
          String(lote.productoId) === String(productoId) &&
          Number(lote.cantidad) > 0
      )
      .sort(
        (a, b) =>
          new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
      );
  };

  const registrarVenta = () => {
    if (!form.productoId || !form.cantidadVendida) {
      alert("Completa todos los campos.");
      return;
    }

    const cantidadSolicitada = Number(form.cantidadVendida);

    if (cantidadSolicitada <= 0) {
      alert("La cantidad vendida debe ser mayor que cero.");
      return;
    }

    const lotesDisponibles = obtenerLotesOrdenados(form.productoId);

    if (lotesDisponibles.length === 0) {
      alert("No hay lotes disponibles para este producto.");
      return;
    }

    const totalDisponible = lotesDisponibles.reduce(
      (acc, lote) => acc + Number(lote.cantidad),
      0
    );

    if (cantidadSolicitada > totalDisponible) {
      alert(
        `No hay suficiente existencia. Disponible total: ${totalDisponible}.`
      );
      return;
    }

    let cantidadRestante = cantidadSolicitada;
    const movimientosVenta = [];
    const lotesActualizados = [...lotes];

    for (const lote of lotesDisponibles) {
      if (cantidadRestante <= 0) break;

      const disponible = Number(lote.cantidad);
      const cantidadTomada =
        cantidadRestante <= disponible ? cantidadRestante : disponible;

      movimientosVenta.push({
        id: Date.now() + Math.random(),
        productoId: Number(form.productoId),
        nombreProducto: form.nombreProducto,
        loteId: Number(lote.id),
        codigoLote: lote.codigoLote,
        cantidadVendida: cantidadTomada
      });

      const index = lotesActualizados.findIndex((l) => l.id === lote.id);

      if (index !== -1) {
        lotesActualizados[index] = {
          ...lotesActualizados[index],
          cantidad: Number(lotesActualizados[index].cantidad) - cantidadTomada
        };
      }

      cantidadRestante -= cantidadTomada;
    }

    dispatch({
      type: "ADD_MANY",
      payload: movimientosVenta
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

  const stockDisponibleProducto = useMemo(() => {
    if (!form.productoId) return 0;

    return lotes
      .filter((lote) => String(lote.productoId) === String(form.productoId))
      .reduce((acc, lote) => acc + Number(lote.cantidad), 0);
  }, [lotes, form.productoId]);

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
          Registra ventas de productos. El sistema utilizará automáticamente los
          lotes con vencimiento más próximo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card
          titulo="Total de movimientos"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Stock disponible del producto
                </label>
                <input
                  className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                  value={
                    form.productoId
                      ? `Disponible total: ${stockDisponibleProducto}`
                      : ""
                  }
                  placeholder="Stock disponible"
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
              Cada línea representa el lote utilizado en la venta.
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
                    Lote usado
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