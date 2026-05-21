import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Receipt,
  Search,
  Ban,
  FileText,
  DollarSign,
  Eye,
  X
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Facturas({ setVista }) {
  const [facturas, setFacturas] = useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [facturaDetalle, setFacturaDetalle] =
    useState(null);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const res = await fetch(
        `${API_URL}/facturas`
      );

      const data = await res.json();

      setFacturas(
  Array.isArray(data)
    ? data
    : data.facturas || []
);
    } catch (error) {
      console.error(error);

      alert(
        "Error al cargar facturas"
      );
    }
  };

  const visualizarFactura = async (
    idFactura
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/facturas/${idFactura}`
      );

      const data = await res.json();

      console.log(data);

      setFacturaDetalle(data);

      setMostrarModal(true);
    } catch (error) {
      console.error(error);

      alert(
        "Error al visualizar factura"
      );
    }
  };

  const anularFactura = async (
    idFactura
  ) => {
    const confirmar = confirm(
      "¿Deseas anular esta factura?"
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `${API_URL}/facturas/anular`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            idFactura
          })
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error al anular factura"
        );
      }

      alert("Factura anulada");

      cargarFacturas();
    } catch (error) {
      console.error(error);

      alert(
        "Error al anular factura"
      );
    }
  };

  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) =>
      `${f.idFactura} ${f.nombre} ${f.nit}`
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )
    );
  }, [facturas, busqueda]);

  const estadisticas = useMemo(() => {
    return {
      totalFacturas: facturas.length,

      totalVentas:
        facturas.reduce(
          (acc, item) =>
            acc +
            Number(item.totalPagar || 0),
          0
        ),

      anuladas: facturas.filter(
        (f) =>
          f.estado === "ANULADA"
      ).length
    };
  }, [facturas]);

  const EstadoBadge = ({
    estado
  }) => {
    if (estado === "ANULADA") {
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
          Anulada
        </span>
      );
    }

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
        Activa
      </span>
    );
  };

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
              Facturas
            </h1>

            <p className="text-slate-400 mt-2">
              Gestión administrativa
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

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-violet-100
              flex
              items-center
              justify-center
            "
          >
            <Receipt
              size={22}
              className="text-violet-700"
            />
          </div>

          <div>

            <p className="text-sm text-slate-400">
              Total facturas
            </p>

            <h3 className="text-2xl font-bold text-slate-900">
              {
                estadisticas.totalFacturas
              }
            </h3>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="
            bg-white
            rounded-[30px]
            border
            border-gray-100
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Facturas
              </p>

              <h2 className="text-4xl font-bold text-blue-600 mt-4">
                {
                  estadisticas.totalFacturas
                }
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-100
                flex
                items-center
                justify-center
              "
            >
              <FileText
                size={26}
                className="text-blue-700"
              />
            </div>

          </div>

        </div>

        <div
          className="
            bg-white
            rounded-[30px]
            border
            border-gray-100
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Ventas totales
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-4">
                Q
                {estadisticas.totalVentas.toFixed(
                  2
                )}
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-green-100
                flex
                items-center
                justify-center
              "
            >
              <DollarSign
                size={26}
                className="text-green-700"
              />
            </div>

          </div>

        </div>

        <div
          className="
            bg-white
            rounded-[30px]
            border
            border-gray-100
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-400">
                Anuladas
              </p>

              <h2 className="text-4xl font-bold text-red-600 mt-4">
                {
                  estadisticas.anuladas
                }
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-red-100
                flex
                items-center
                justify-center
              "
            >
              <Ban
                size={26}
                className="text-red-700"
              />
            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}
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

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Historial facturas
              </h2>

              <p className="text-slate-400 mt-2">
                Facturación registrada en el sistema
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
                placeholder="Buscar factura..."
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

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Factura
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Cliente
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  NIT
                </th>

                <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500">
                  Total
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

              {facturasFiltradas.map(
                (factura) => (
                  <tr
                    key={
  factura.idFactura ||
  factura.id
}
                    className="
                      border-t
                      border-gray-100
                      hover:bg-slate-50
                      transition-all
                    "
                  >

                    <td className="px-6 py-5 font-medium text-slate-700">
                      #
                      
{
  factura.noFactura ||
  factura.id
}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {
                        factura.nombreCliente
                      }
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {factura.nit}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-900">
                      Q
                      {Number(
                        factura.totalPagar
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <EstadoBadge
                        estado={
                          factura.estado
                        }
                      />
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-center gap-3">

                        <button
                          onClick={() =>
                            visualizarFactura(
  factura.idFactura ||
  factura.id
)
                          }
                          className="
                            px-5
                            py-3
                            rounded-2xl
                            bg-blue-100
                            text-blue-700
                            font-medium
                            flex
                            items-center
                            gap-3
                            hover:bg-blue-200
                            transition-all
                          "
                        >

                          <Eye size={18} />

                          Visualizar

                        </button>

                        {factura.estado ===
                        "ANULADA" ? (
                          <button
                            disabled
                            className="
                              px-5
                              py-3
                              rounded-2xl
                              bg-slate-100
                              text-slate-400
                              font-medium
                              cursor-not-allowed
                            "
                          >
                            Anulada
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              anularFactura(
  factura.idFactura ||
  factura.id
)
                            }
                            className="
                              px-5
                              py-3
                              rounded-2xl
                              bg-red-100
                              text-red-700
                              font-medium
                              flex
                              items-center
                              gap-3
                              hover:bg-red-200
                              transition-all
                            "
                          >

                            <Ban
                              size={18}
                            />

                            Anular

                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL FACTURA PREMIUM */}
      {mostrarModal &&
        facturaDetalle && (
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
              overflow-y-auto
            "
          >

            <div
              className="
                bg-white
                rounded-[36px]
                w-full
                max-w-6xl
                shadow-2xl
                overflow-hidden
              "
            >

              {/* HEADER */}
              <div
                className="
                  bg-gradient-to-r
                  from-blue-600
                  via-blue-700
                  to-violet-600
                  px-10
                  py-8
                  text-white
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h1 className="text-5xl font-bold">
                    Factura electrónica
                  </h1>

                  <p className="text-white/80 mt-3 text-lg">
                    Visualización de factura
                  </p>

                </div>

                <button
                  onClick={() =>
                    setMostrarModal(false)
                  }
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    hover:bg-white/20
                    transition-all
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X size={28} />
                </button>

              </div>

              {/* BODY */}
              <div className="p-10">

                {/* TOP INFO */}
                <div className="grid grid-cols-3 gap-10 mb-10">

                  {/* LEFT */}
                  <div className="space-y-6">

                    <div>

                      <h1 className="text-5xl font-black text-slate-900">
                        DrogueriaRogil
                      </h1>

                      <p className="text-slate-500 mt-3 text-lg">
                        Salud y bienestar para todos
                      </p>

                    </div>

                    <div className="space-y-4 text-lg">

                      <div className="flex gap-4">

                        <span className="font-bold text-slate-700">
                          Fecha:
                        </span>

                        <span className="text-slate-600">
                          {new Date().toLocaleDateString()}
                        </span>

                      </div>

                      <div className="flex gap-4">

                        <span className="font-bold text-slate-700">
                          Cliente:
                        </span>

                        <span className="text-slate-600">
                          {
                            facturaDetalle
                              .factura
                              ?.nombre ||
                              facturaDetalle.nombreCliente ||
                              "Consumidor Final"
                          }
                        </span>

                      </div>

                      <div className="flex gap-4">

                        <span className="font-bold text-slate-700">
                          NIT:
                        </span>

                        <span className="text-slate-600">
                          {
                            facturaDetalle
                              .factura?.nit ||
                              facturaDetalle.nit ||
                              "CF"
                          }
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* CENTER */}
                  <div className="flex flex-col items-center justify-center">

                    <div
                      className="
                        w-52
                        h-52
                        rounded-3xl
                        border-2
                        border-slate-200
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        text-center
                        bg-slate-50
                      "
                    >

                      QR Factura

                    </div>

                    <p className="text-slate-400 mt-5">
                      Verificación electrónica
                    </p>

                  </div>

                  {/* RIGHT */}
                  <div className="flex justify-end">

                    <div
                      className="
                        border
                        border-violet-200
                        rounded-3xl
                        px-8
                        py-6
                        text-right
                        bg-violet-50
                        h-fit
                      "
                    >

                      <p className="text-slate-500 text-lg">
                        No.
                      </p>

                      <h2 className="text-4xl font-black text-violet-700 mt-2">
                        #
                       {
  facturaDetalle
    .factura
    ?.noFactura ||
    facturaDetalle.noFactura ||
    facturaDetalle.id
}
                      </h2>

                      <p className="text-slate-400 mt-4">
                        Serie A
                      </p>

                    </div>

                  </div>

                </div>

                {/* TABLE */}
                <div
                  className="
                    border
                    border-slate-200
                    rounded-[28px]
                    overflow-hidden
                    mb-10
                  "
                >

                  <table className="w-full">

                    <thead className="bg-slate-100">

                      <tr>

                        <th className="px-6 py-5 text-left text-slate-700 font-bold">
                          Producto
                        </th>

                        <th className="px-6 py-5 text-center text-slate-700 font-bold">
                          Cantidad
                        </th>

                        <th className="px-6 py-5 text-center text-slate-700 font-bold">
                          Precio
                        </th>

                        <th className="px-6 py-5 text-right text-slate-700 font-bold">
                          Subtotal
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {(
                        facturaDetalle.detalle ||
                        facturaDetalle.productos ||
                        []
                      ).map(
                        (
                          producto,
                          index
                        ) => (
                          <tr
                            key={index}
                            className="
                              border-t
                              border-slate-100
                            "
                          >

                            <td className="px-6 py-6 text-slate-800 font-medium">
                              {
                                producto.nombre
                              }
                            </td>

                            <td className="px-6 py-6 text-center text-slate-600">
                              {
                                producto.cantidad
                              }
                            </td>

                            <td className="px-6 py-6 text-center text-slate-600">
                              Q
                              {Number(
                                producto.precio ||
                                  producto.precioUnitario ||
                                  0
                              ).toFixed(2)}
                            </td>

                            <td className="px-6 py-6 text-right font-bold text-slate-900">
                              Q
                              {Number(
                                producto.subtotal ||
                                  (
                                    producto.precio *
                                    producto.cantidad
                                  ) ||
                                  0
                              ).toFixed(2)}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {/* FOOTER */}
                <div className="grid grid-cols-2 gap-10">

                  {/* LEFT */}
                  <div
                    className="
                      border
                      border-slate-200
                      rounded-[28px]
                      p-8
                    "
                  >

                    <h3 className="text-2xl font-bold text-violet-700 mb-5">
                      Observaciones
                    </h3>

                    <p className="text-slate-500 text-lg leading-relaxed">
                      Gracias por su preferencia.
                      DrogueriaRogil agradece su confianza.
                    </p>

                  </div>

                  {/* RIGHT */}
                  <div
                    className="
                      border
                      border-slate-200
                      rounded-[28px]
                      overflow-hidden
                    "
                  >

                    <div className="p-8 space-y-5">

                      <div className="flex items-center justify-between">

                        <p className="text-xl text-slate-500">
                          Subtotal
                        </p>

                        <p className="text-xl font-bold text-slate-800">
                          Q
                          {Number(
                            facturaDetalle
                              .factura
                              ?.totalPagar ||
                              facturaDetalle.totalPagar ||
                              0
                          ).toFixed(2)}
                        </p>

                      </div>

                      <div className="flex items-center justify-between">

                        <p className="text-xl text-slate-500">
                          Descuento
                        </p>

                        <p className="text-xl font-bold text-slate-800">
                          Q0.00
                        </p>

                      </div>

                    </div>

                    {/* TOTAL */}
                    <div
                      className="
                        bg-violet-50
                        border-t
                        border-violet-100
                        px-8
                        py-7
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <h2 className="text-3xl font-black text-violet-700">
                        TOTAL A PAGAR
                      </h2>

                      <h2 className="text-5xl font-black text-violet-700">
                        Q
                        {Number(
                          facturaDetalle
                            .factura
                            ?.totalPagar ||
                            facturaDetalle.totalPagar ||
                            0
                        ).toFixed(2)}
                      </h2>

                    </div>

                  </div>

                </div>

                {/* FOOTER TEXT */}
                <div className="mt-10 flex items-center justify-between">

                  <p className="text-slate-400 text-lg">
                    Factura generada electrónicamente
                  </p>

                  <p className="text-violet-600 text-xl font-semibold italic">
                    ¡Gracias por confiar en DrogueriaRogil!
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Facturas;