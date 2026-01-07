const BASE_URL = "http://127.0.0.1:8000";

// ===============================
// Helper: Auth Headers
// ===============================
function getAuthHeaders(json = true) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const headers = {
    Authorization: token,
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// ===============================
// 1️⃣ Generate Fitness Plan (TEMP)
// ===============================
export async function generateFitnessPlan(data) {
  const res = await fetch(`${BASE_URL}/generate-plan`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to generate plan");
  }

  return res.json();
}

// ===============================
// 2️⃣ Confirm Fitness Plan (SAVE)
// ===============================
export async function confirmFitnessPlan(plan) {
  const res = await fetch(`${BASE_URL}/confirm-plan`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      fitness_data: plan.fitness_data,
      schedule: plan.schedule,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to confirm plan");
  }

  return res.json();
}

// ===============================
// 3️⃣ Get Saved Plan (After Login)
// ===============================
export async function getMyFitnessPlan() {
  const res = await fetch(`${BASE_URL}/my-plan`, {
    method: "GET",
    headers: getAuthHeaders(false),
  });

  if (res.status === 404) {
    return null; // No saved plan
  }

  if (!res.ok) {
    throw new Error("Failed to fetch saved plan");
  }

  return res.json();
}
