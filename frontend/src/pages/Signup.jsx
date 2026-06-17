import { useState } from "react";
import { signup } from "../services/api";

function Signup({ setShowLogin }) {
  const [form, setForm] = useState({ name: "", accountNumber: "", pin: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.pin.length !== 4) return alert("PIN must be exactly 4 digits.");
    setIsLoading(true);

    try {
      await signup(form);
      alert("Account Created Successfully!");
      setShowLogin(true);
    } catch (error) {
      alert(error.message || "Error Creating Account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-slate-900 via-slate-950 to-indigo-950 px-4">
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[400px] border border-slate-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-white tracking-tight">Create Account</h1>
        <p className="text-xs text-slate-400 text-center mb-6">Join the Apex Cloud Network</p>

        <form onSubmit={handleSignup}>
          <input
            className="w-full bg-slate-800/40 border border-slate-800 text-white p-3 rounded-xl mb-3 focus:outline-hidden focus:border-indigo-500"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="w-full bg-slate-800/40 border border-slate-800 text-white p-3 rounded-xl mb-3 focus:outline-hidden focus:border-indigo-500"
            placeholder="Account Number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            required
          />

          <input
            className="w-full bg-slate-800/40 border border-slate-800 text-white p-3 rounded-xl mb-4 focus:outline-hidden focus:border-indigo-500 font-mono tracking-widest"
            placeholder="4-Digit PIN"
            name="pin"
            type="password"
            maxLength={4}
            value={form.pin}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-600/10 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Saving Node..." : "Register Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <button
            className="text-indigo-400 font-semibold hover:underline cursor-pointer"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;