import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { createFactura, updateFactura, deleteFactura } from '../services/facturaService';
import { getFacturasByServicio } from '../services/servicioService';
import { SearchBar } from "./SearchBar";
import { BillCard } from './BillCard';
import { BillModal } from './BillModal';
import { ConfirmModal } from './ConfirmModal';
import { PaginationCard } from "./PaginationCard";
import { toast } from 'sonner';
import { logger } from "../utils/logger";

export const Bills = () => {
  const { servicioId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const servicioInfo = location.state?.servicio;

  // Estados de Paginación
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [facturaEditando, setFacturaEditando] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    let ignorarRespuesta = false;

    const fetchFacturas = async () => {
      try {
        setLoading(true);
        const data = await getFacturasByServicio(servicioId, { page });
        if (!ignorarRespuesta) {
          setFacturas(data.facturas || data || []);
          setPagination(data.pagination || null);
          setError(null);

          const facturaState = location.state?.facturaAEditar;
          if (facturaState) {
            setFacturaEditando(facturaState);
            setShowModal(true);
          }
        }
      } catch (err) {
        logger.error('Error al obtener facturas:', err);
        if (!ignorarRespuesta) {
          setError('No se pudieron cargar las facturas de este servicio.');
        }
      } finally {
        if (!ignorarRespuesta) {
          setLoading(false);
        }
      }
    };

    if (servicioId) {
      fetchFacturas();
    }

    return () => {
      ignorarRespuesta = true;
    };
  }, [servicioId, location.state, page]);

  const handleOpenCreate = () => {
    setFacturaEditando(null);
    setShowModal(true);
  };

  const handleOpenEdit = (factura) => {
    setFacturaEditando(factura);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFacturaEditando(null);
  };

  const handleSubmitModal = async (formData) => {
    if (facturaEditando) {
      setConfirmConfig({
        title: 'Confirmar actualización',
        message: '¿Estás seguro de que querés guardar los cambios en esta factura?',
        confirmText: 'Actualizar',
        variant: 'warning',
        onConfirm: () => ejecutarUpdate(facturaEditando.id, formData),
      });
    } else {
      ejecutarCreate(formData);
    }
  };

  const ejecutarCreate = async (formData) => {
    try {
      setSubmitting(true);
      const nuevaFactura = await createFactura(formData);
      setFacturas((prev) => {
        const nuevaLista = [nuevaFactura, ...prev];
        setPagination((p) => p ? { ...p, total: p.total + 1, totalPages: Math.ceil((p.total + 1) / p.limit) } : null);
        return nuevaLista;
      });
      handleCloseModal();
      toast.success('Factura agregada correctamente');
    } catch (err) {
      logger.error('Error al crear factura:', err);
      toast.error(err.response?.data?.error || 'No se pudo registrar la factura.');
    } finally {
      setSubmitting(false);
    }
  };

  const ejecutarUpdate = async (id, formData) => {
    try {
      setConfirmLoading(true);
      const facturaActualizada = await updateFactura(id, formData);
      
      setFacturas((prev) =>
        prev.map((f) => (f.id === id ? facturaActualizada : f))
      );

      setConfirmConfig(null);
      handleCloseModal();
      toast.success('Factura actualizada correctamente');
    } catch (err) {
      logger.error('Error al actualizar factura:', err);
      toast.error('Ocurrió un error al actualizar la factura.');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteRequest = (factura) => {
    setConfirmConfig({
      title: "Eliminar factura",
      message: `¿Seguro quiere eliminar la factura "${factura.id}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      variant: "danger",
      onConfirm: () => ejecutarDelete(factura.id),
    });
  };

  const ejecutarDelete = async (id) => {
    try {
      setConfirmLoading(true);
      await deleteFactura(id);
      setFacturas((prev) => {
        const nuevaLista = prev.filter((s) => s.id !== id);
        setPagination((p) => p ? { ...p, total: Math.max(0, p.total - 1), totalPages: Math.ceil(Math.max(0, p.total - 1) / p.limit) } : null);
        return nuevaLista;
      });
      setConfirmConfig(null);
      toast.success("Factura eliminada correctamente");
    } catch (err) {
      logger.error("Error al eliminar factura:", err);
      toast.error(err.response?.data?.error || "Error al eliminar la factura.");
    } finally {
      setConfirmLoading(false);
    }
  }

  const facturasFiltradas = facturas
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
    .filter((f) => {
    const termino = searchTerm.toLowerCase().trim();

    const idMatch = f?.id
      ? String(f.id).toLowerCase().includes(termino) : false;

    const fechaVtoMatch = f?.fechaVencimiento
      ? String(f.fechaVencimiento).toLowerCase().includes(termino) : false;

    const coincideTexto = idMatch || fechaVtoMatch;
    return coincideTexto;
  });

  return (
    <div className="container py-4">
      {/* Botón Volver y Cabecera */}
      <button
        className="btn btn-outline-secondary btn-sm mb-3"
        onClick={() => navigate('/services')}
      >
        ← Volver a Mis Servicios
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Facturas {servicioInfo ? `de ${servicioInfo.nombre}` : ''}
          </h2>
          <p className="text-muted mb-0">
            Historial y pagos pendientes del servicio #{servicioId}
          </p>
        </div>
        <button className="btn btn-primary fw-semibold px-3" onClick={handleOpenCreate}>
          + Nueva Factura
        </button>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholderText={"Buscar por N° de factura o vencimiento"} />

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Grilla de Facturas */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando facturas...</span>
          </div>
        </div>
      ) : facturasFiltradas.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          {facturas.length === 0
            ? "No tenés facturas registradas todavía."
            : "No se encontraron facturas que coincidan con la búsqueda."}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {facturasFiltradas.map((factura) => (
            <div className="col" key={factura.id}>
              <BillCard factura={factura} 
              onEdit={handleOpenEdit} 
              onDelete={() => handleDeleteRequest(factura)}
              />
            </div>
          ))}

          {/* Card de Paginación que ocupa el espacio sobrante de la última fila */}
          <PaginationCard
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Modal de Formulario */}
      {showModal && (
        <BillModal
          key={facturaEditando ? facturaEditando.id : 'nueva'}
          servicioId={servicioId}
          facturaEditando={facturaEditando}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          submitting={submitting}
        />
      )}

      {/* Modal de Confirmación para Edición */}
      {confirmConfig && (
        <ConfirmModal
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          variant={confirmConfig.variant}
          loading={confirmLoading}
          onConfirm={confirmConfig.onConfirm}
          onClose={() => setConfirmConfig(null)}
        />
      )}
    </div>
  );
};