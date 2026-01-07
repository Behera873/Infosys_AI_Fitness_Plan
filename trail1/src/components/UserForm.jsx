import { useState } from "react";
import { generateFitnessPlan } from "../services/api";

export default function UserForm({ onResult }) {
  const [form, setForm] = useState({
    user_id: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    goal: "Flexibility",
    level: "Beginner",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_id: "user123", // Placeholder user ID
      age: Number(form.age),
      gender: form.gender,
      height: Number(form.height.replace(/\D/g, "")),
      weight: Number(form.weight.replace(/\D/g, "")),
      goal: form.goal,
      level: form.level,
    };

    try {
      const data = await generateFitnessPlan(payload);
      onResult(data);
    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <input placeholder="Age" onChange={(e)=>setForm({...form,age:e.target.value})}/>
      <select onChange={(e)=>setForm({...form,gender:e.target.value})}>
        <option>Male</option><option>Female</option>
      </select>
      <input placeholder="Height (cm)" onChange={(e)=>setForm({...form,height:e.target.value})}/>
      <input placeholder="Weight (kg)" onChange={(e)=>setForm({...form,weight:e.target.value})}/>
      <select onChange={(e)=>setForm({...form,goal:e.target.value})}>
        <option>Flexibility</option>
        <option>Muscle Gain</option>
        <option>Weight Loss</option>
      </select>
      <select onChange={(e)=>setForm({...form,level:e.target.value})}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Fitness Plan"}
      </button>
    </form>
  );
}
