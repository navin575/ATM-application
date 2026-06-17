import { useState } from "react";
import { login } from "../services/api";

function Login({ setUser, setShowLogin }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(accountNumber, pin);
      setUser({
        name: response.name,
        accountNumber: response.accountNumber,
        balance: response.balance
      });
    } catch (error) {
      alert(error.message || "Invalid Account Number or PIN");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-tr from-slate-900 via-slate-950 to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[400px] border border-slate-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-white tracking-tight">ATM Login</h1>
        <p className="text-xs text-slate-400 text-center mb-6">Secure Cloud Authorization</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-slate-800/40 border border-slate-800 text-white p-3 rounded-xl mb-4 focus:outline-hidden focus:border-indigo-500"
            required
          />

          <input
            type="password"
            placeholder="PIN"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-slate-800/40 border border-slate-800 text-white p-3 rounded-xl mb-4 focus:outline-hidden focus:border-indigo-500 font-mono tracking-widest"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-600/10 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Verifying Keys..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={() => setShowLogin(false)}
            className="text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;