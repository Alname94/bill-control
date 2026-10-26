import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Error404 = () => {
  const { isAuthenticated } = useAuth();

  const targetRoute = isAuthenticated ? "/dashboard" : "/auth/login";
  const buttonText = isAuthenticated ? "Volver al Dashboard" : "Ir al Inicio de Sesión";

  return (
    <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center bg-secondary py-4">
      <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="card-body">
          <h1 className="display-1 fw-bold text-danger mb-0">404</h1>
          <h2 className="fw-bold mb-3">¡UPS! Página no encontrada</h2>
          <p className="text-muted mb-4">
            La página a la que estás intentando acceder no existe o fue movida a otra dirección.
          </p>
          <Link to={targetRoute} className="btn btn-outline-dark fw-bold w-100">
            <i className="bi bi-arrow-left me-2"></i>
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};