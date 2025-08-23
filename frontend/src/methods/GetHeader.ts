
export function getAuthHeader() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token missing. Please login.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}