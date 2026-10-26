import { useNavigate } from 'react-router-dom';

export const ServiceCard = ({ servicio, onEdit, onDelete, isDeleting }) => {
  const { id, nombre, nroCliente, activo } = servicio;
  const navigate = useNavigate();

  const handleVerFacturas = () => {
    navigate(`/services/${servicio.id}/bills`, { state: { servicio } });
  };

  return (
    <div className="card h-100 border-0 shadow">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold text-dark mb-0">{nombre}</h5>
            <span className={`badge bg-${activo ? 'success' : 'secondary'}`}>
              {activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <p className="card-text text-muted mb-3">
            <small className="fw-semibold">N° Cliente:</small><br />
            {nroCliente ? nroCliente : <span className="text-muted italic">Sin especificar</span>}
          </p>
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            className="btn btn-outline-dark btn-sm fw-semibold"
            onClick={handleVerFacturas}
          >
            Ver Facturas →
          </button>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(servicio)}
            disabled={isDeleting}
          >
            Editar
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(id, nombre)}
            disabled={isDeleting}
          >
            {isDeleting ? (<span className="spinner-border spinner-border-sm" role="status" />) : ('Eliminar')}
          </button>
        </div>
      </div>
    </div>
  );
};