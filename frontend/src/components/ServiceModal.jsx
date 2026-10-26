import { useState } from 'react';

const FORM_INICIAL = {
  nombre: '',
  nroCliente: '',
  activo: true
};

export const ServiceModal = ({ onClose, onSubmit, servicioEditando, submitting }) => {
  const [formData, setFormData] = useState(() => {
    if (servicioEditando) {
      return {
        nombre: servicioEditando.nombre || '',
        nroCliente: servicioEditando.nroCliente || '',
        activo: servicioEditando.activo ?? true,
      };
    }
    return FORM_INICIAL;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre del Servicio</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  placeholder="Ej. Metrogas, EDENOR, Fibertel"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">N° de Cliente</label>
                <input
                  type="text"
                  className="form-control"
                  name="nroCliente"
                  placeholder="Ej. 123456789"
                  value={formData.nroCliente}
                  onChange={handleChange}
                />
              </div>

              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activoSwitch"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="activoSwitch">
                  Servicio Activo
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Guardando...' : servicioEditando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};