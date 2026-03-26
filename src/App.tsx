import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Applications from "./pages/Applications";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Resume from "./pages/Resume";
import Signup from "./pages/Signup";
import Statistics from "./pages/Statistics";
import { ProtectedRoute, PublicOnlyRoute } from "./routes/RouteGuards";

export default function App() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <Signup />
          </PublicOnlyRoute>
        }
      />

      {/* 보호 라우트 */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
