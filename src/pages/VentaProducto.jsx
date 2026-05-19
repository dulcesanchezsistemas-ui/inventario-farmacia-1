import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Trash2,
  CreditCard,
  Wallet,
  Landmark,
  Receipt,
  Plus
} from "lucide-react";

const API_URL = "http://localhost:3000";

function VentaProducto({ setVista }) {
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [carrito, setCarrito] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState("");

  const [cantidad, setCantidad] = useState("");

  const [cliente, setCliente] = useState({
    nit: "CF",
    nombre: "CONSUMIDOR FINAL",
    direccion: "Ciudad"
  });

  const [metodoPago, setMetodoPago] =
    useState("Efectivo");

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
      alert("Error al cargar productos");
    }
  };

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) =>
      `${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [productos, busqueda]);

  const total = carrito.reduce(
    (acc, item) =>
      acc +
      Number(item.precio) * Number(item.cantidad),
    0
  );

  const agregarAlCarrito = () => {
    if (!productoSeleccionado || !cantidad) {
      alert("Selecciona producto y cantidad");
      return;
    }

    const producto = productos.find(
      (p) =>
        p.idProducto === productoSeleccionado
    );

    if (!producto) return;

    const existe = carrito.find(
      (item) =>
        item.idProducto === producto.idProducto
    );

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.idProducto ===
          producto.idProducto
            ? {
                ...item,
                cantidad:
                  Number(item.cantidad) +
                  Number(cantidad)
              }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          cantidad: Number(cantidad)
        }
      ]);
    }

    setCantidad("");
    setProductoSeleccionado("");
  };

  const quitarProducto = (idProducto) => {
    setCarrito(
      carrito.filter(
        (item) =>
          item.idProducto !== idProducto
      )
    );
  };

  const limpiarVenta = () => {
    setCarrito([]);

    setProductoSeleccionado("");

    setCantidad("");

    setCliente({
      nit: "CF",
      nombre: "CONSUMIDOR FINAL",
      direccion: "Ciudad"
    });

    setMetodoPago("Efectivo");
  };

  const facturar = async () => {
    if (carrito.length === 0) {
      alert("Agrega productos");
      return;
    }

    try {
      const body = {
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        nit: cliente.nit,
        total: total,
        productos: carrito.map((item) => ({
          idProducto: item.idProducto,
          cantidad: Number(item.cantidad)
        }))
      };

      const res = await fetch(
        `${API_URL}/facturas`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error al facturar"
        );
      }

      alert("Factura registrada");

      limpiarVenta();
    } catch (error) {
      console.error(error);

      alert("Error al generar factura");
    }
  };

  const MetodoPagoButton = ({
    titulo,
    icono
  }) => (
    <button
      onClick={() =>
        setMetodoPago(titulo)
      }
      className={`
        rounded-2xl
        border
        p-4
        flex
        items-center
        gap-4
        transition-all
        ${
          metodoPago === titulo
            ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-lg"
            : "bg-white border-gray-100 hover:border-violet-200"
        }
      `}
    >

      <div
        className={`
          w-12
          h-12
          rounded-2xl
          flex
          items-center
          justify-center
          ${
            metodoPago === titulo
              ? "bg-white/20"
              : "bg-slate-100"
          }
        `}
      >
        {icono}
      </div>

      <div className="text-left">

        <p className="font-semibold">
          {titulo}
        </p>

        <p
          className={`
            text-sm
            ${
              metodoPago === titulo
                ? "text-white/70"
                : "text-slate-400"
            }
          `}
        >
          Método de pago
        </p>

      </div>

    </button>
  );

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
              Facturación
            </h1>

            <p className="text-slate-400 mt-2">
              Punto de venta farmacéutico
            </p>

          </div>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Receipt
              size={22}
              className="text-violet-700"
            />
          </div>

          <div>

            <p className="text-sm text-slate-400">
              Total actual
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              Q{total.toFixed(2)}
            </h3>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* CLIENTE */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Datos cliente
                </h2>

                <p className="text-slate-400 mt-2">
                  Información de facturación
                </p>

              </div>

              <div className="w-14 h-14 rounded-3xl bg-blue-100 flex items-center justify-center">
                <Receipt
                  size={26}
                  className="text-blue-700"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <input
                value={cliente.nit}
                onChange={(e) =>
                  setCliente({
                    ...cliente,
                    nit: e.target.value
                  })
                }
                placeholder="NIT"
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
                value={cliente.nombre}
                onChange={(e) =>
                  setCliente({
                    ...cliente,
                    nombre: e.target.value
                  })
                }
                placeholder="Nombre"
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
                value={cliente.direccion}
                onChange={(e) =>
                  setCliente({
                    ...cliente,
                    direccion:
                      e.target.value
                  })
                }
                placeholder="Dirección"
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

          </div>

          {/* PRODUCTOS */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Productos
                </h2>

                <p className="text-slate-400 mt-2">
                  Agrega productos a la factura
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
                  placeholder="Buscar producto..."
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              <select
                value={productoSeleccionado}
                onChange={(e) =>
                  setProductoSeleccionado(
                    e.target.value
                  )
                }
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
                    key={
                      producto.idProducto
                    }
                    value={
                      producto.idProducto
                    }
                  >
                    {producto.nombre}
                  </option>
                ))}

              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(
                    e.target.value
                  )
                }
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

              <button
                onClick={
                  agregarAlCarrito
                }
                className="
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-blue-600
                  text-white
                  font-medium
                  flex
                  items-center
                  justify-center
                  gap-3
                  hover:shadow-lg
                  transition-all
                "
              >

                <Plus size={18} />

                Agregar

              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {productosFiltrados
                .slice(0, 6)
                .map((producto) => (
                  <button
                    key={
                      producto.idProducto
                    }
                    onClick={() =>
                      setProductoSeleccionado(
                        producto.idProducto
                      )
                    }
                    className="
                      text-left
                      bg-slate-50
                      border
                      border-gray-100
                      rounded-3xl
                      p-5
                      hover:shadow-lg
                      hover:-translate-y-1
                      transition-all
                    "
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {
                            producto.nombre
                          }
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {
                            producto.idProducto
                          }
                        </p>

                      </div>

                      <div className="bg-violet-100 text-violet-700 px-3 py-2 rounded-2xl text-sm font-semibold">
                        Q
                        {Number(
                          producto.precio
                        ).toFixed(2)}
                      </div>

                    </div>

                    <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                      {
                        producto.descripcion
                      }
                    </p>

                  </button>
                ))}

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* CARRITO */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Factura
                </h2>

                <p className="text-slate-400 mt-2">
                  {carrito.length} productos
                </p>

              </div>

              <div className="w-14 h-14 rounded-3xl bg-green-100 flex items-center justify-center">
                <ShoppingCart
                  size={24}
                  className="text-green-700"
                />
              </div>

            </div>

            {carrito.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-gray-200 py-16 text-center">

                <ShoppingCart
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <p className="text-slate-400 mt-4">
                  No hay productos
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {carrito.map((item) => (
                  <div
                    key={
                      item.idProducto
                    }
                    className="
                      bg-slate-50
                      rounded-3xl
                      p-5
                      border
                      border-gray-100
                    "
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {item.nombre}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {
                            item.cantidad
                          }{" "}
                          x Q
                          {item.precio.toFixed(
                            2
                          )}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          quitarProducto(
                            item.idProducto
                          )
                        }
                        className="
                          w-10
                          h-10
                          rounded-2xl
                          bg-red-100
                          text-red-700
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </div>

                    <div className="flex items-center justify-between mt-5">

                      <p className="text-sm text-slate-400">
                        Subtotal
                      </p>

                      <p className="font-bold text-slate-900">
                        Q
                        {(
                          item.precio *
                          item.cantidad
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* TOTAL */}
            <div className="border-t border-gray-100 mt-8 pt-6">

              <div className="flex items-center justify-between">

                <p className="text-slate-400">
                  Total
                </p>

                <h2 className="text-4xl font-bold text-slate-900">
                  Q
                  {total.toFixed(2)}
                </h2>

              </div>

            </div>

          </div>

          {/* METODO PAGO */}
          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Método pago
            </h2>

            <p className="text-slate-400 mt-2">
              Selecciona método
            </p>

            <div className="space-y-4 mt-8">

              <MetodoPagoButton
                titulo="Efectivo"
                icono={
                  <Wallet size={22} />
                }
              />

              <MetodoPagoButton
                titulo="Tarjeta"
                icono={
                  <CreditCard
                    size={22}
                  />
                }
              />

              <MetodoPagoButton
                titulo="Transferencia"
                icono={
                  <Landmark size={22} />
                }
              />

            </div>

            <button
              onClick={facturar}
              className="
                w-full
                h-16
                mt-8
                rounded-3xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                text-white
                font-semibold
                text-lg
                hover:shadow-2xl
                transition-all
              "
            >
              Facturar
            </button>

            <button
              onClick={limpiarVenta}
              className="
                w-full
                h-14
                mt-4
                rounded-3xl
                bg-slate-100
                text-slate-700
                font-medium
                hover:bg-slate-200
                transition-all
              "
            >
              Limpiar venta
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default VentaProducto;















