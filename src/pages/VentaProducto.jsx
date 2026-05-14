import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:3000";

function VentaProducto() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [cliente, setCliente] = useState({
    nit: "CF",
    nombre: "CONSUMIDOR FINAL"
  });
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los productos.");
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      `${p.id} ${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [productos, busqueda]);

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
    0
  );

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || !cantidad) {
      alert("Selecciona un producto e ingresa una cantidad.");
      return;
    }

    const producto = productos.find((p) => p.id === productoSeleccionado);

    if (!producto) {
      alert("Producto no válido.");
      return;
    }

    if (Number(cantidad) <= 0) {
      alert("La cantidad debe ser mayor que cero.");
      return;
    }

    const existe = carrito.find((item) => item.id === producto.id);

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: Number(item.cantidad) + Number(cantidad) }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          cantidad: Number(cantidad)
        }
      ]);
    }

    setProductoSeleccionado("");
    setCantidad("");
  };

  const quitarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const limpiarVenta = () => {
    setCarrito([]);
    setProductoSeleccionado("");
    setCantidad("");
    setCliente({
      nit: "CF",
      nombre: "CONSUMIDOR FINAL"
    });
    setMetodoPago("Efectivo");
  };

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      alert("Agrega productos a la venta.");
      return;
    }

    try {
      for (const item of carrito) {
        const res = await fetch(`${API_URL}/lotes/vender`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idProducto: item.id,
            cantidadVendida: Number(item.cantidad)
          })
        });

        if (!res.ok) {
          throw new Error(`Error al vender ${item.nombre}`);
        }
      }

      alert("Venta registrada correctamente.");
      limpiarVenta();
    } catch (error) {
      console.error(error);
      alert("Error al registrar la venta. Revisa el backend.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl shadow-sm p-8 text-white">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <p className="text-sm text-blue-200 font-medium">
              Módulo de ventas
            </p>
            <h1 className="text-3xl font-bold mt-2">Punto de Venta</h1>
            <p className="text-slate-200 mt-2">
              Registra ventas de productos. El backend asigna automáticamente el lote correspondiente.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
            <p className="text-sm text-slate-300">Total actual</p>
            <p className="text-3xl font-bold text-green-300">
              Q{total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Datos de venta
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Información básica del cliente.
                </p>
              </div>

              <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                Caja activa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  NIT
                </label>
                <input
                  value={cliente.nit}
                  onChange={(e) =>
                    setCliente({ ...cliente, nit: e.target.value })
                  }
                  className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 font-medium">
                  Cliente
                </label>
                <input
                  value={cliente.nombre}
                  onChange={(e) =>
                    setCliente({ ...cliente, nombre: e.target.value })
                  }
                  className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Agregar artículos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona productos y agrégalos al carrito.
                </p>
              </div>

              <input
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 xl:min-w-[320px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={agregarAlCarrito}
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl px-5 py-3 font-semibold transition-all shadow-sm"
              >
                Agregar al carrito
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
              {productosFiltrados.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProductoSeleccionado(p.id)}
                  className="text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-3xl p-5 transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-800">{p.nombre}</p>
                      <p className="text-xs text-gray-400 mt-1">{p.id}</p>
                    </div>
                    <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                      Q{Number(p.precio).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    {p.descripcion}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Método de pago
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Efectivo", "Tarjeta", "Transferencia"].map((metodo) => (
                <button
                  key={metodo}
                  onClick={() => setMetodoPago(metodo)}
                  className={`rounded-2xl px-5 py-4 border font-semibold transition-all ${
                    metodoPago === metodo
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {metodo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Resumen
              </h2>
              <p className="text-sm text-gray-500">
                {carrito.length} artículos
              </p>
            </div>

            <button
              onClick={limpiarVenta}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all"
            >
              Limpiar
            </button>
          </div>

          {carrito.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-4xl mb-2">🛒</div>
              <p className="text-gray-500">No hay productos agregados.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {carrito.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.id}
                      </p>
                    </div>

                    <button
                      onClick={() => quitarProducto(item.id)}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs"
                    >
                      X
                    </button>
                  </div>

                  <div className="flex justify-between mt-3 text-sm text-gray-600">
                    <span>Cantidad: {item.cantidad}</span>
                    <span>Q{item.precio.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between mt-2 font-bold text-gray-800">
                    <span>Subtotal</span>
                    <span>Q{(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3 border-t pt-5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Q{total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Descuento</span>
              <span>Q0.00</span>
            </div>

            <div className="flex justify-between text-2xl font-bold text-green-600">
              <span>Total</span>
              <span>Q{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5 bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">Método de pago</p>
            <p className="font-bold text-gray-800">{metodoPago}</p>
          </div>

          <button
            onClick={registrarVenta}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-sm"
          >
            Registrar venta
          </button>
        </div>
      </div>
    </div>
  );
}

export default VentaProducto;





















