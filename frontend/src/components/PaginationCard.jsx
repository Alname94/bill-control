/**
 * Tarjeta de paginación reutilizable diseñada para integrarse en la grilla de Bootstrap.
 *
 * @param {Object} props
 * @param {Object} props.pagination - Objeto de paginación retornado por el backend ({ totalPages, page, total, limit })
 * @param {Function} props.onPageChange - Callback que recibe el número de la nueva página seleccionada.
 */
export const PaginationCard = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page = 1, totalPages = 1, total = 0 } = pagination;

  return (
    <div className="col-12 col-md-4 d-flex align-items-center">
      <div className="card shadow-sm border-0 w-100 h-100 bg-light p-3 d-flex flex-column justify-content-center align-items-center">
        <span className="text-muted small fw-semibold mb-1">
          Página {page} de {totalPages}
        </span>
        <span
          className="text-muted extra-small mb-3"
          style={{ fontSize: "0.8rem" }}
        >
          (Total: {total} registros)
        </span>

        <div
          className="btn-group w-100"
          role="group"
          aria-label="Navegación de páginas"
        >
          <button
            type="button"
            className="btn btn-outline-dark btn-sm fw-semibold"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <i className="bi bi-chevron-left me-1"></i> Anterior
          </button>

          <button
            type="button"
            className="btn btn-outline-dark btn-sm fw-semibold"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Siguiente <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
