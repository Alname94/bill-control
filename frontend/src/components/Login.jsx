import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev,[name]: value,}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await login(formData);
      if (!result.ok) {
        setErrorMessage(result.error);
        setFormData({ email: "", password: "" });
        setIsSubmitting(false);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado");
      setFormData({ email: "", password: "" });
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center bg-secondary py-4">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>

          {errorMessage && (<div className="alert alert-danger py-2 text-center fw-bold" role="alert">{errorMessage}</div>)}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email
              </label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} 
                onChange={handleChange} placeholder="nombre@ejemplo.com" required />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">
                Password
              </label>
              <input type="password" className="form-control" id="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn btn-outline-dark w-100 fw-bold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando...
                </>
              ) : ("Ingresar")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};