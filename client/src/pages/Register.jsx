import { useState } from "react";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();

  const getName = (e) => setUserName(e.target.value);
  const getEmail = (e) => setUserEmail(e.target.value);
  const getPassword = (e) => setUserPassword(e.target.value);
  const getConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const checks = {
    length: userPassword.length >= 8,
    upperCase: /[A-Z]/.test(userPassword),
    number: /[0-9]/.test(userPassword),
  };

  const createAccount = async () => {
    if (!checks.length || !checks.upperCase || !checks.number || confirmPassword !== userPassword) {
      setShowErrors(true);
    } else {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: userEmail, password: userPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setShowErrors(true);
        return;
      }
    }
    setConfirmation("Account Created!");
    setShowErrors(false);
    navigate("/login");
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <div className="auth__brand">
            <div className="auth__logo" />
            <h1 className="auth__title">Finance Tracker</h1>
          </div>
          <p className="auth__subtitle">Create your account to start tracking income and expenses.</p>
        </div>

        <div className="auth__body">
          <div className="form">
            <div className="field">
              <div className="label">Full name</div>
              <input className="input" type="text" placeholder="Enter your name" onChange={getName} />
            </div>

            <div className="field">
              <div className="label">Email</div>
              <input className="input" type="email" placeholder="Enter your email" onChange={getEmail} />
            </div>

            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" placeholder="Choose a password" onChange={getPassword} />
              {showErrors && (!checks.length || !checks.upperCase || !checks.number) && (
                <ul className="rules">
                  {!checks.length && <li>At least 8 characters</li>}
                  {!checks.upperCase && <li>At least 1 uppercase letter</li>}
                  {!checks.number && <li>At least 1 number</li>}
                </ul>
              )}
            </div>

            <div className="field">
              <div className="label">Confirm password</div>
              <input className="input" type="password" placeholder="Confirm password" onChange={getConfirmPassword} />
              {showErrors && confirmPassword !== userPassword && (
                <p className="error">Passwords do not match</p>
              )}
            </div>

            <div className="auth__actions">
              <button className="button button--primary" onClick={createAccount}>
                Create account
              </button>
              {confirmation && <p>{confirmation}</p>}
              <div className="divider" />
              <div className="helper">
                <span>Already have an account?</span>
                <Link to="/login" className="button button--ghost">
                  Login
                </Link>
              </div>
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

export default Register;