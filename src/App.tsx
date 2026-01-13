import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
