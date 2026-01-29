import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../pages/PrivateRoute.jsx";
import Line from "../pages/Line.jsx";
import DownTime from "../pages/Downtime.jsx";
import Assembly from "../pages/Assembly.jsx";
import CycleTime from "../pages/CycleTime.jsx";
import Quality from "../pages/Quality.jsx";
// pages
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Error from "../pages/Error.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />


      <Route
        path="/Line"
        element={
          <PrivateRoute>
            <Line />
          </PrivateRoute>
        }
      />

      <Route
        path="/Assembly"
        element={
          <PrivateRoute>
            <Assembly />
          </PrivateRoute>
        }
      />

<Route
        path="/DownTime"
        element={
          <PrivateRoute>
            <DownTime />
          </PrivateRoute>
        }
      />

      <Route
        path="/CycleTime"
        element={
          <PrivateRoute>
            <CycleTime />
          </PrivateRoute>
        }
      />

      <Route
        path="/Quality"
        element={
          <PrivateRoute>
            <Quality />
          </PrivateRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
