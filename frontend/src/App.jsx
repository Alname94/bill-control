import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Error404 } from "./components/Error404";
import { Navbar } from "./components/Navbar";
import { Services } from "./components/Services";
import { Bills } from "./components/Bills";

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="d-flex flex-column flex-grow-1">
        <Routes>
          <Route path="/auth/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bills" element={<Bills />} />
          </Route>
          <Route path={"*"} element={<Error404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
