import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000";

function VentaProducto() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  const [form, setForm] = useState({
    idProducto: "",
    nombreProducto: "",
    cantidadVendida: ""
  });

  const cargarProductos = async () => {
    const res = await fetch(`${API_URL}/productos`);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idProducto") {
      const producto = productos.find((p) => p.id === value);

      setForm({
        idProducto: value,
        nombreProducto: producto ? producto.nombre : "",
        cantidadVendida: ""
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const limpiar = () => {
    setForm({
      idProducto: "",
      nombreProducto: "",
      cantidadVendida: ""
    });
  };

  const registrarVenta = async () => {
    if (!form.idProducto || !form.cantidadVendida) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/lotes/vender`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idProducto: form.idProducto,
          cantidadVendida: Number(form.cantidadVendida)
        })
      });

      if (!res.ok) throw new Error("Error al registrar venta");

      const nuevaVenta = {
        id: Date.now(),
        nombreProducto: form.nombreProducto,
        idProducto: form.idProducto,
        cantidadVendida: Number(form.cantidadVendida)
      };

      setVentas([...ventas, nuevaVenta]);
      limpiar();

      alert("Venta registrada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al registrar venta.");
    }
  };

  const totalVentas = ventas.length;

  const totalUnidadesVendidas = ventas.reduce(
    (acc, v) => acc + Number(v.cantidadVendida),
    0
  );

  const productoMasVendido = useMemo(() => {
    if (ventas.length === 0) return "N/A";

    const conteo = {};

    ventas.forEach((v) => {
      if (!conteo[v.nombreProducto]) conteo[v.nombreProducto] = 0;
      conteo[v.nombreProducto] += Number(v.cantidadVendida);
    });

    return Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );
  }, [ventas]);

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
          Registra ventas enviando el producto y cantidad al backend. La base de
          datos seleccionará automáticamente el lote correspondiente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card titulo="Ventas" valor={totalVentas} color="bg-gray-800" />
        <Card
          titulo="Unidades vendidas"
          valor={totalUnidadesVendidas}
          color="bg-blue-600"
        />
        <Card
          titulo="Producto más vendido"
          valor={productoMasVendido}
          color="bg-green-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Registrar venta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="idProducto"
            value={form.idProducto}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cantidadVendida"
            placeholder="Cantidad a vender"
            value={form.cantidadVendida}
            onChange={handleChange}
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={registrarVenta}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-medium"
          >
            Registrar venta
          </button>

          <button
            onClick={limpiar}
            className="bg-gray-200 hover:bg-gray-300 active:scale-95 transition-all text-gray-800 px-5 py-3 rounded-xl font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Historial local de ventas
        </h2>

        {ventas.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No hay ventas registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Producto
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Código
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">
                    Cantidad vendida
                  </th>
                </tr>
              </thead>

              <tbody>
                {ventas.map((v) => (
                  <tr key={v.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-gray-800 font-medium">
                      {v.nombreProducto}
                    </td>
                    <td className="p-4 text-gray-600">{v.idProducto}</td>
                    <td className="p-4 text-gray-600">{v.cantidadVendida}</td>
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