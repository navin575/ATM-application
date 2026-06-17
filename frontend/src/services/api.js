const BASE_URL = "http://localhost:3000/api";

// 🔐 Account Registration / Signup
export const signup = async (userData) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }
  return res.json();
};

// 🔏 Account Authorization / Login
export const login = async (accountNumber, pin) => {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, pin }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Invalid credentials");
  }
  return res.json();
};

// 📩 Cloud Balance Vault Deposit
export const deposit = async (accountNumber, amount) => {
  const res = await fetch(`${BASE_URL}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, amount }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Deposit execution failed");
  }
  return res.json();
};

// 💵 Cloud Balance Vault Withdrawal
export const withdraw = async (accountNumber, amount) => {
  const res = await fetch(`${BASE_URL}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountNumber, amount }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Withdrawal failed");
  }
  return res.json();
};