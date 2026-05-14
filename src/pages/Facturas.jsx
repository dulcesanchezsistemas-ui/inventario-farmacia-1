function Facturas() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl shadow-sm p-8 text-white">
        <div>
          <p className="text-sm text-blue-200 font-medium">
            Módulo de facturación
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Facturación
          </h1>

          <p className="text-slate-200 mt-2">
            Este módulo se encuentra en desarrollo.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
        <div className="text-6xl mb-5">🧾</div>

        <h2 className="text-2xl font-bold text-gray-800">
          Módulo pendiente
        </h2>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          La sección de facturación será desarrollada posteriormente e incluirá
          generación de facturas, historial y control de pagos.
        </p>
      </div>
    </div>
  );
}

export default Facturas;