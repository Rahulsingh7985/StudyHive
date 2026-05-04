import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Protected Route
import PrivateRoute from "./components/PrivateRoute.jsx";
import Room from "./pages/Room.jsx";
import RoomDetail from "./pages/RoomDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/room"
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
        <Route path="/room/:roomId"
          element={
            <privateRoute>
              <RoomDetail />
            </privateRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;