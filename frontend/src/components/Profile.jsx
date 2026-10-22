import { useState, useEffect } from "react";
import { getUsuario, updateUsuario, updatePassword, deleteUsuario } from "../services/usuarioService";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { logger } from "../utils/logger";

export const Profile = () => {
  const { logout, updateUserContext } = useAuth();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ nombre: "", email: "" });

  const [nombreInput, setNombreInput] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  const [passwords, setPasswords] = useState({
    passwordActual: "",
    passwordNuevo: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUsuario();
        const userData = data.usuario || data; 
        setUser(userData);
        setNombreInput(userData.nombre || "");
      } catch (err) {
        logger.error("Error al cargar perfil:", err);
        toast.error("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nombreInput.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    try {
      setUpdatingName(true);
      const response = await updateUsuario({ nombre: nombreInput });
      
      const updatedUser = response.usuario || response;
      setUser(updatedUser);
      setNombreInput(updatedUser.nombre);

      updateUserContext({ nombre: updatedUser.nombre });

      toast.success("¡Nombre actualizado con éxito!");
    } catch (err) {
      logger.error("Error al actualizar nombre:", err);
      toast.error(err.response?.data?.error || "No se pudo actualizar el nombre.");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.passwordActual || !passwords.passwordNuevo) {
      toast.error("Completá todos los campos de contraseña.");
      return;
    }

    try {
      setUpdatingPassword(true);
      await updatePassword(passwords);
      toast.success("¡Contraseña actualizada con éxito!");
      setPasswords({ passwordActual: "", passwordNuevo: "" });
    } catch (err) {
      logger.error("Error al actualizar contraseña:", err);
      toast.error(err.response?.data?.error || "Error al actualizar la contraseña.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE") {
      toast.error("Debes escribir DELETE exactamente para confirmar.");
      return;
    }

    try {
      setDeleting(true);
      await deleteUsuario();
      toast.success("Cuenta eliminada correctamente.");
      logout();
    } catch (err) {
      logger.error("Error al eliminar cuenta:", err);
      toast.error(err.response?.data?.error || "No se pudo eliminar la cuenta.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">Mi Perfil</h2>

      {/* Información Personal */}
      <div className="card shadow-sm border-0 mb-4 p-4">
        <h5 className="fw-bold mb-3">Información Personal</h5>
        <form onSubmit={handleUpdateName}>
          <div className="mb-3">
            <label className="form-label text-muted">
              Email (No modificable)
            </label>
            <input
              type="email"
              className="form-control bg-light"
              value={user.email || ""}
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-outline-primary"
                disabled={updatingName}
              >
                {updatingName ? "Guardando..." : "Actualizar"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Cambiar Contraseña */}
      <div className="card shadow-sm border-0 mb-4 p-4">
        <h5 className="fw-bold mb-3">Seguridad - Cambiar Contraseña</h5>
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña Actual</label>
            <input
              type="password"
              className="form-control"
              value={passwords.passwordActual}
              onChange={(e) =>
                setPasswords({ ...passwords, passwordActual: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Nueva Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={passwords.passwordNuevo}
              onChange={(e) =>
                setPasswords({ ...passwords, passwordNuevo: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 fw-semibold"
            disabled={updatingPassword}
          >
            {updatingPassword ? "Actualizando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>

      {/* Zona de Peligro */}
      <div className="card shadow-sm border-danger mb-4 p-4">
        <h5 className="fw-bold text-danger mb-2">Zona de Peligro</h5>
        <p className="text-muted small mb-3">
          Una vez que elimines tu cuenta, se perderán todos tus datos asociados.
        </p>
        <button
          type="button"
          className="btn btn-outline-danger fw-semibold"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar Cuenta
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  ¿Estás completamente seguro?
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmationText("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="small text-muted">
                  Escribí la palabra <strong>DELETE</strong> para confirmar la
                  eliminación de la cuenta:
                </p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribí DELETE"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmationText("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={deleteConfirmationText !== "DELETE" || deleting}
                  onClick={handleDeleteAccount}
                >
                  {deleting ? "Eliminando..." : "Sí, eliminar mi cuenta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};