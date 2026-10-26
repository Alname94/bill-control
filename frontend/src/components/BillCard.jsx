export const BillCard = ({ factura, onEdit, onDelete, isDeleting }) => {
  const { id, monto, fechaVencimiento, pagado } = factura;

  const fechaLimpia = fechaVencimiento.split('T')[0];
  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-muted small">Factura #{id}</span>
          <span
            className={`badge ${
              pagado ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning-emphasis border border-warning'
            }`}
          >
            {pagado ? 'Pagado' : 'Pendiente'}
          </span>
        </div>

        <h3 className="fw-bold text-primary mb-3">
          ${monto ? monto.toLocaleString('es-AR') : '0'}
        </h3>

        <p className="card-text text-muted small mb-3">
          <strong>Vencimiento:</strong> {fechaLimpia || 'Sin fecha'}
        </p>

        <div className="mt-auto gap-2 pt-2 border-top d-flex justify-content-end">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(factura)}
          >
            ✏️ Editar
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(id)}
            disabled={isDeleting}
          >
            {isDeleting ? (<span className="spinner-border spinner-border-sm" role="status" />) : ('Eliminar')}
          </button>
        </div>
      </div>
    </div>
  );
};