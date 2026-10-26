import { useState } from 'react';

const FORM_INICIAL = {
  monto: '',
  fechaVencimiento: '',
  pagado: false,
};

export const BillModal = ({ servicioId, facturaEditando = null, onClose, onSubmit, submitting = false, }) => {
  const [formData, setFormData] = useState(() => {
    if (facturaEditando) {
      return {
        monto: facturaEditando.monto || '',
        fechaVencimiento: String(facturaEditando.fechaVencimiento).split('T')[0] || '',
        pagado: facturaEditando.pagado ?? false
      }
    }
    return FORM_INICIAL;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      servicioId: Number(servicioId),
      monto: Number(formData.monto),
      fechaVencimiento: formData.fechaVencimiento.split("T")[0],
      pagado: Boolean(formData.pagado),
    });
  };

  const isEditing = Boolean(facturaEditando);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {isEditing ? `Editar Factura #${facturaEditando.id}` : "Nueva Factura"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={submitting}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Campo Monto */}
              <div className="mb-3">
                <label htmlFor="monto" className="form-label fw-semibold">
                  Monto (&#36;)
                </label>
                <div className="input-group">
                  <span className="input-group-text">&#36;</span>
                  <input type="number" step="1.00" min="0" id="monto" name="monto"
                    className="form-control" placeholder="0.00" value={formData.monto}
                    onChange={handleChange} disabled={submitting} required />
                </div>
              </div>

              {/* Campo Fecha de Vencimiento */}
              <div className="mb-3">
                <label
                  htmlFor="fechaVencimiento"
                  className="form-label fw-semibold"
                >
                  Fecha de Vencimiento
                </label>
                <input type="date" id="fechaVencimiento" name="fechaVencimiento" className="form-control"
                  value={formData.fechaVencimiento} onChange={handleChange} disabled={submitting} required />
              </div>

              {/* Checkbox Estado de Pago */}
              <div className="form-check form-switch mt-4 mb-2">
                <input className="form-check-input" type="checkbox" role="switch" id="pagado"
                  name="pagado" checked={formData.pagado} onChange={handleChange} disabled={submitting} />
                <label className="form-check-label fw-semibold" htmlFor="pagado">
                  Pagado
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary fw-semibold" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : isEditing ? ("Guardar Cambios") : ("Crear Factura")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};