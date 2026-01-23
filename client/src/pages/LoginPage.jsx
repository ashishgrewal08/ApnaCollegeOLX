import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Log in to AnaCollegeOLX</h2>
          <p className="page-subtitle">
            Access your listings and sell / buy items with your campus.
          </p>
        </div>
      </div>

      {err && <p className="form-error">{err}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            placeholder="College email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary mt-sm" type="submit">
          Log in
        </button>
      </form>
    </>
  );
}


