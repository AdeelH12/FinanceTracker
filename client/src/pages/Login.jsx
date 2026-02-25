import { useState } from "react";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const getEmail = (e) => setEmail(e.target.value);
  const getPassword = (e) => setPassword(e.target.value);

  const login = async () => {
    setErrorMessage("");

    if (!email) {
      return setErrorMessage("Please enter your email");
    }
    if (!password) {
      return setErrorMessage("Please enter your password");
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) {
        return setErrorMessage(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        income: data.user.income,
        expenses: data.user.expenses,
        balance: data.user.balance
      }));
      navigate("/dashboard");

    } catch (error) {
      console.log("Error during login:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <div className="auth__brand">
            <div className="auth__logo" />
            <h1 className="auth__title">Finance Tracker</h1>
          </div>
          <p className="auth__subtitle">Welcome back. Log in to continue.</p>
        </div>

        <div className="auth__body">
          <div className="form">
            <div className="field">
              <div className="label">Email</div>
              <input className="input" type="email" placeholder="Email" onChange={getEmail} />
            </div>

            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" placeholder="Password" onChange={getPassword} />
            </div>

            <div className="auth__actions">
              <button className="button button--primary" type="button" onClick={login}>
                Log in
              </button>

              {errorMessage && <p className="error">{errorMessage}</p>}

              <Link to="/register" className="button button--ghost">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="auth__panel">
        <div className="auth__panel-inner">
          <div className="auth__panel-tag">Finance Tracker</div>
          <h2 className="auth__panel-heading">
            Take control of<br />your <span>finances</span>
          </h2>
          <p className="auth__panel-sub">
            Track income, manage expenses, and get a clear picture of your financial health — all in one place.
          </p>
          <div className="auth__stats">
            <div className="auth__stat">
              <div className="auth__stat-value">12k+</div>
              <div className="auth__stat-label">Users</div>
            </div>
            <div className="auth__stat">
              <div className="auth__stat-value">$2M+</div>
              <div className="auth__stat-label">Tracked</div>
            </div>
            <div className="auth__stat">
              <div className="auth__stat-value">99%</div>
              <div className="auth__stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;