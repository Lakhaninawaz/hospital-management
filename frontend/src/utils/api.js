const API_BASE_URL = "http://localhost:5000/api";
const FILE_BASE_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, method = "GET", body, token) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getFileUrl = (path) => `${FILE_BASE_URL}${path}`;
