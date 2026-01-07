import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Planner from "./pages/Planner";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 1️⃣ Landing (includes Auth Modal) */}
        <Route path="/" element={<Landing />} />

        {/* 2️⃣ User Details + Planner */}
        <Route path="/planner" element={<Planner />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}
