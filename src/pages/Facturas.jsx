import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  Receipt,
  Search,
  Ban,
  FileText,
  DollarSign,
  ShoppingBag
} from "lucide-react";

const API_URL = "http://localhost:3000";

function Facturas({ setVista }) {
  const [facturas, setFacturas] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const res = await fetch(
        `${API_URL}/facturas`
      );

      const data = await res.json();

      setFacturas(data);
    } catch (error) {
      console.error(error);

      alert("Error al cargar facturas");
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

      alert("Error al anular factura");
    }
  };

  const facturasFiltradas = useMemo(() => {
    return facturas.filter((f) =>
      `${f.idFactura} ${f.nombre} ${f.nit}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [facturas, busqueda]);

  const estadisticas = useMemo(() => {
    return {
      totalFacturas: facturas.length,

      totalVentas: facturas.reduce(
        (acc, item) =>
          acc + Number(item.total || 0),
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

        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
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

        <div className="bg-white rounded-[30px] border border-gray-100 p-6 shadow-sm">

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

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FileText
                size={26}
                className="text-blue-700"
              />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-[30px] border border-gray-100 p-6 shadow-sm">

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

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <DollarSign
                size={26}
                className="text-green-700"
              />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-[30px] border border-gray-100 p-6 shadow-sm">

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

            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <Ban
                size={26}
                className="text-red-700"
              />
            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">

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
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {facturasFiltradas.map(
                (factura) => (
                  <tr
                    key={
                      factura.idFactura
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
                        factura.idFactura
                      }
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {
                        factura.nombre
                      }
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {factura.nit}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-900">
                      Q
                      {Number(
                        factura.total
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

                      <div className="flex items-center justify-center">

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
                                factura.idFactura
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

    </div>
  );
}

export default Facturas;