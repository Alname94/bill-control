import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { getServiciosByUser, createServicio, updateServicio, deleteServicio } from '../services/servicioService';
import { SearchBar } from './SearchBar';
import { ServiceCard } from './ServiceCard';
import { ServiceModal } from './ServiceModal';
import { ConfirmModal } from './ConfirmModal';
import { PaginationCard } from "./PaginationCard";
import { logger } from '../utils/logger';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export const Services = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Paginación
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Estado de Búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el Modal
  const [showModal, setShowModal] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Estados para el Modal de Confirmación
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useDocumentTitle("Servicios");

  // Carga de datos
  useEffect(() => {
    let ignorarRespuesta = false;

    const fetchServicios = async () => {
      try {
        setLoading(true);
        const data = await getServiciosByUser({ page });
        if (!ignorarRespuesta) {
          setServicios(data.servicios || []);
          setPagination(data.pagination || null);
          setError(null);
        }
      } catch (err) {
        logger.error('Error al obtener servicios:', err);
        if (!ignorarRespuesta) {
          setError('No se pudieron cargar los servicios.');
        }
      } finally {
        if (!ignorarRespuesta) {
          setLoading(false);
        }
      }
    };

    fetchServicios();

    return () => {
      ignorarRespuesta = true;
    };
  }, [page]);

  // Controladores del Modal
  const handleOpenCreate = () => {
    setServicioEditando(null);
    setShowModal(true);
  };

  const handleOpenEdit = (servicio) => {
    setServicioEditando(servicio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServicioEditando(null);
  };

  const handleSubmitModal = async (formData) => {
    if (servicioEditando) {
      setConfirmConfig({
        title: "Confirmar actualización",
        message: `¿Seguro quiere actualizar el servicio "${servicioEditando.nombre}"?`,
        confirmText: "Guardar cambios",
        variant: "warning",
        onConfirm: () => ejecutarUpdate(servicioEditando.id, formData),
      });
    } else {
      ejecutarCreate(formData);
    }
  };

  const ejecutarCreate = async (formData) => {
    try {
      setSubmitting(true);
      const nuevoServicio = await createServicio(formData);
      setServicios((prev) => {
        const nuevaLista = [nuevoServicio, ...prev];
        setPagination((p) => p ? { ...p, total: p.total + 1, totalPages: Math.ceil((p.total + 1) / p.limit) } : null);
        return nuevaLista;
      });
      handleCloseModal();
      toast.success("Servicio creado correctamente");
    } catch (err) {
      logger.error("Error al crear servicio:", err);
      toast.error(err.response?.data?.error || "Ocurrió un error al crear el servicio.");
    } finally {
      setSubmitting(false);
    }
  };

  const ejecutarUpdate = async (id, formData) => {
    try {
      setConfirmLoading(true);
      const servicioActualizado = await updateServicio(id, formData);

      setServicios((prev) =>
        prev.map((s) => (s.id === id ? servicioActualizado : s)),
      );

      setConfirmConfig(null);
      toast.success("Servicio actualizado correctamente");
      handleCloseModal();
    } catch (err) {
      logger.error("Error al actualizar servicio:", err);
      toast.error(err.response?.data?.error ||"Ocurrió un error al actualizar el servicio.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteRequest = (servicio) => {
    setConfirmConfig({
      title: "Eliminar servicio",
      message: `¿Seguro quiere eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      variant: "danger",
      onConfirm: () => ejecutarDelete(servicio.id),
    });
  };

  const ejecutarDelete = async (id) => {
    try {
      setConfirmLoading(true);
      await deleteServicio(id);
      setServicios((prev) => {
        const nuevaLista = prev.filter((s) => s.id !== id);
        setPagination((p) => p ? { ...p, total: Math.max(0, p.total - 1), totalPages: Math.ceil(Math.max(0, p.total - 1) / p.limit) } : null);
        return nuevaLista;
      });
      setConfirmConfig(null);
      toast.success("Servicio eliminado correctamente");
    } catch (err) {
      logger.error("Error al eliminar servicio:", err);
      toast.error(err.response?.data?.error || "Error al eliminar el servicio.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const serviciosFiltrados = servicios
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .filter((s) => {
    const termino = searchTerm.toLowerCase().trim();

    const nombreMatch = s?.nombre
      ? String(s.nombre).toLowerCase().includes(termino) : false;

    const nroClienteMatch = s?.nroCliente
      ? String(s.nroCliente).toLowerCase().includes(termino) : false;

    const coincideTexto = nombreMatch || nroClienteMatch;
    return coincideTexto;
  });

  return (
    <div className="container py-4">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mis Servicios</h2>
          <p className="text-muted mb-0">
            Gestioná tus servicios e identificadores de cliente
          </p>
        </div>
        <button
          className="btn btn-primary fw-semibold px-3"
          onClick={handleOpenCreate}
        >
          + Nuevo Servicio
        </button>
      </div>

      {/* Filtros */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholderText={"Buscar por nombre o N° de cliente..."} />

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Grilla de Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
        </div>
      ) : serviciosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          {servicios.length === 0
            ? "No tenés servicios registrados todavía."
            : "No se encontraron servicios que coincidan con la búsqueda."}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {serviciosFiltrados.map((servicio) => (
            <div className="col" key={servicio.id}>
              <ServiceCard
                servicio={servicio}
                onEdit={handleOpenEdit}
                onDelete={() => handleDeleteRequest(servicio)}
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

      {/* Modal para Crear/Editar */}
      {showModal && (
        <ServiceModal
          key={servicioEditando ? servicioEditando.id : "nuevo"}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          servicioEditando={servicioEditando}
          submitting={submitting}
        />
      )}

      {/* Modal de Confirmación */}
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