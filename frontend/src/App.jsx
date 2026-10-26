import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Error404 } from "./components/Error404";
import { Navbar } from "./components/Navbar";
import { Services } from "./components/Services";
import { Bills } from "./components/Bills";
import { Toaster } from "sonner";
import { Auth } from "./components/Auth";
import { Profile } from "./components/Profile";

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="d-flex flex-column flex-grow-1">
        <Routes>
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/register" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:servicioId/bills" element={<Bills />} />
            <Route path="/user" element={<Profile />} />
          </Route>
          <Route path={"*"} element={<Error404 />} />
        </Routes>
        <Toaster richColors position="bottom-right" closeButton />
      </main>
    </div>
  );
};

export default App;
