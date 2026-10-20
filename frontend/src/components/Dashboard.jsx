import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServiciosByUser, getFacturasByServicio } from '../services/servicioService.js';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { toast } from 'sonner';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalMes, setTotalMes] = useState(0);

  useEffect(() => {
    let ignorarRespuesta = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const serviciosData = await getServiciosByUser();
        const listaServicios = serviciosData.servicios || serviciosData || [];

        if (ignorarRespuesta) return;

        const promesasFacturas = listaServicios.map(async (servicio) => {
          try {
            const resBills = await getFacturasByServicio(servicio.id);
            const facturas = resBills.facturas || resBills || [];
            return facturas.map((f) => ({ ...f, nombreServicio: servicio.nombre }));
          } catch (err) {
            console.error(`Error al cargar facturas del servicio ${servicio.id}:`, err);
            return [];
          }
        });

        const resultadosFacturas = await Promise.all(promesasFacturas);
        const todasLasFacturas = resultadosFacturas.flat();

        if (ignorarRespuesta) return;

        const pendientes = todasLasFacturas.filter((f) => !f.pagado);
        setFacturasPendientes(pendientes);

        const sumaTotalPendientes = pendientes.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
        setTotalPendiente(sumaTotalPendientes);

        const fechaActual = new Date();
        const facturasMesActual = todasLasFacturas.filter((f) => {
          const fechaVencimiento = new Date(f.fechaVencimiento);
          return (
            fechaVencimiento.getMonth() === fechaActual.getMonth() &&
            fechaVencimiento.getFullYear() === fechaActual.getFullYear()
          );
        });
        const sumaTotalMes = facturasMesActual.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
        setTotalMes(sumaTotalMes);

      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        toast.error('No se pudieron cargar los datos del dashboard.');
      } finally {
        if (!ignorarRespuesta) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      ignorarRespuesta = true;
    };
  }, []);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Panel de Control</h2>
        <p className="text-muted">
          Resumen general de tus servicios y compromisos de pago.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white">
            <div className="card-body">
              <h6 className="card-title text-50">Total Pendiente</h6>
              <h3 className="fw-bold mb-0">
                $
                {totalPendiente.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
              <small className="text-white-50">
                Acumulado de facturas sin pagar
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title text-muted">Facturas Pendientes</h6>
              <h3 className="fw-bold mb-0 text-warning">
                {facturasPendientes.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="card-title text-muted">Total del Mes</h6>
              <h3 className="fw-bold mb-0 text-black-50">
                $
                {totalMes.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Facturas Pendientes */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Facturas Pendientes de Pago</h5>
          <Link
            to="/services"
            className="btn btn-sm btn-outline-primary fw-semibold"
          >
            Ver todos los servicios →
          </Link>
        </div>
        <div className="card-body p-0">
          {facturasPendientes.length === 0 ? (
            <div className="text-center py-4 text-muted">
              🎉 ¡Excelente! No tenés facturas pendientes de pago.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Servicio</th>
                    <th>Vencimiento</th>
                    <th>Monto</th>
                    <th className="text-end pe-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasPendientes.map((factura) => (
                    <tr key={factura.id}>
                      <td className="ps-3 fw-semibold">
                        {factura.nombreServicio}
                      </td>
                      <td>
                        {factura.fechaVencimiento
                          ? factura.fechaVencimiento.split("T")[0]
                          : "Sin fecha"}
                      </td>
                      <td className="fw-bold text-danger">
                        $
                        {Number(factura.monto).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-end pe-3">
                        <Link
                          to={`/services/${factura.servicioId}/bills`}
                          state={{
                            facturaAEditar: factura,
                            servicio: {
                              id: factura.servicioId,
                              nombre: factura.nombreServicio,
                            },
                          }}
                          className="btn btn-sm btn-light border"
                        >
                          Gestionar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};