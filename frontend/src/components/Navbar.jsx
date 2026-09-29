import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg py-3">
      <div className="container-fluid px-5">
        {/* Nombre de la app + icono */}
        <NavLink
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5"
          to={isAuthenticated ? "/dashboard" : "/auth/login"}
        >
          <i className="bi bi-receipt-cutoff"></i>
          <span>Bill Control</span>
        </NavLink>

        {/* Si está autenticado, renderizamos las opciones de navegación */}
        {isAuthenticated && (
          <>
            {/* Botón Toggler para pantallas pequeñas*/}
            <button className="navbar-toggler p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation" >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Contenido colapsable */}
            <div className="collapse navbar-collapse" id="navbarContent">
              {/* Links principales a la izquierda */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 column-gap-2">
                <li className="nav-item col-6 col-lg-auto">
                  <NavLink className={({ isActive }) => `nav-link py-2 px-0 px-lg-2 ${isActive ? "active" : ""}`}
                    to="/dashboard"
                  > 
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item col-6 col-lg-auto">
                  <NavLink className={({ isActive }) => `nav-link py-2 px-0 px-lg-2 ${isActive ? "active" : ""}`}
                    to="/services"
                  > 
                    Servicios
                  </NavLink>
                </li>
                <li className="nav-item col-6 col-lg-auto">
                  <NavLink className={({ isActive }) => `nav-link py-2 px-0 px-lg-2 ${isActive ? "active" : ""}`}
                    to="/bills"
                  > 
                    Facturas
                  </NavLink>
                </li>
              </ul>

              {/* Botones de Usuario y Logout al extremo derecho */}
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-3 mt-3 mt-lg-0">
                <NavLink
                  to="/user"
                  className={({ isActive }) => `btn btn-outline-light btn-sm d-flex align-items-center gap-2 ${isActive ? "active" : ""}`}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{user?.nombre || "Usuario"}</span>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm fw-semibold d-flex align-items-center gap-1"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
