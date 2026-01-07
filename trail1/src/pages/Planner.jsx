import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateFitnessPlan,
  confirmFitnessPlan,
  getMyFitnessPlan,
} from "../services/api";
import "./Planner.css";

export default function Planner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    goal: "Flexibility",
    level: "Beginner",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // =====================
  // LOAD SAVED PLAN AFTER LOGIN
  // =====================
  useEffect(() => {
    const loadSavedPlan = async () => {
      try {
        const savedPlan = await getMyFitnessPlan();
        if (savedPlan) {
          setPlan(savedPlan);
          setSaved(true);
        }
      } catch (err) {
        console.log("No saved plan");
      }
    };

    loadSavedPlan();
  }, []);

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // =====================
  // GENERATE PLAN (TEMP)
  // =====================
  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const data = await generateFitnessPlan({
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        goal: form.goal,
        level: form.level,
      });

      setPlan(data);
    } catch {
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // CONFIRM PLAN (SAVE)
  // =====================
  const confirmPlan = async () => {
    try {
      await confirmFitnessPlan(plan);
      setSaved(true);
      alert("Plan saved successfully");
    } catch {
      alert("Failed to save plan");
    }
  };

  return (
    <div className="planner-page">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Personalized Fitness Planner</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* FORM (only if no saved plan) */}
      {!saved && (
        <form className="planner-form" onSubmit={generatePlan}>
          <input
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />

          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            placeholder="Height (cm)"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            required
          />

          <input
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            required
          />

          <select
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          >
            <option>Flexibility</option>
            <option>Muscle Gain</option>
            <option>Weight Loss</option>
          </select>

          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button disabled={loading}>
            {loading ? "Generating..." : "Generate Fitness Plan"}
          </button>
        </form>
      )}

      {/* PLAN DISPLAY */}
      {plan && (
        <>
          <table className="schedule">
            <thead>
              <tr>
                <th>Week</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(plan.schedule).map(([week, days]) => (
                <tr key={week}>
                  <td>{week}</td>
                  {Object.values(days).map((d, i) => (
                    <td key={i}>{d}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* CONFIRM BUTTON */}
          {!saved && (
            <button className="confirm-btn" onClick={confirmPlan}>
              ✅ Confirm Plan
            </button>
          )}
        </>
      )}
    </div>
  );
}
