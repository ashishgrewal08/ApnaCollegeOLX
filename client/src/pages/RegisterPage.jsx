import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    collegeName: "",
    email: "",
    password: ""
  });
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await API.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Create your AnaCollegeOLX account</h2>
          <p className="page-subtitle">
            One account to buy and sell everything inside your campus.
          </p>
        </div>
      </div>

      {err && <p className="form-error">{err}</p>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label>Full name</label>
          <input
            name="name"
            placeholder="Ashish Grewal"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>College name</label>
          <input
            name="collegeName"
            placeholder="NIT Kurukshetra"
            value={form.collegeName}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>College email</label>
          <input
            type="email"
            name="email"
            placeholder="you@college.ac.in"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button className="btn btn-primary mt-sm" type="submit">
          Sign up
        </button>
      </form>
    </>
  );
}
