import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Resume from "./pages/Resume";
import Notes from "./pages/Notes";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./store/authStore";

export default function App() {
  return (
    <AuthProvider>
    <Routes>
      {/* 로그인/회원가입 페이지는 AppLayout 없이 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 나머지 페이지는 AppLayout 사용 */}
      <Route
        path="/*"
        element={
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
        }
      />
    </Routes>
    </AuthProvider>
  );
}
