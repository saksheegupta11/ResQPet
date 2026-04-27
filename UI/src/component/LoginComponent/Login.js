import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const userDetail = { email, password };

    axios.post(ngoApi + "login", userDetail)
      .then((response) => {
        const user = response.data.ngoList;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("_id", user._id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("city", user.city || "");
        
        navigate(user.role === "ngo" ? "/ngo" : "/admin");
      })
      .catch((error) => {
        setLoading(false);
        const msg = error.response?.data?.result || "Login failed. Please try again.";
        setOutput(msg);
        setPassword("");
      });
  };

  return (
    <section className="auth-page section-padding d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-12">
            <motion.div 
              className="premium-card glass p-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="auth-header text-center mb-5">
                <div className="auth-icon-wrapper mb-3">
                  <LogIn size={40} className="text-primary" />
                </div>
                <h2>Welcome Back</h2>
                <p className="text-muted">Enter your credentials to access your dashboard</p>
              </div>

              {output && (
                <div className="alert alert-danger glass d-flex align-items-center mb-4">
                  <AlertCircle size={18} className="me-2" />
                  <small>{output}</small>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Dummy hidden fields to capture initial browser autofill */}
                <input type="text" name="email" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />
                <input type="password" name="password" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />

                <div className="form-group mb-4">
                  <label className="mb-2 d-flex align-items-center">
                    <Mail size={18} className="me-2 text-primary" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    name="real_email"
                    className="form-control premium-input" 
                    placeholder="Enter your email"
                    autoComplete="off"
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="mb-2 d-flex align-items-center">
                    <Lock size={18} className="me-2 text-primary" /> Password
                  </label>
                  <input 
                    type="password" 
                    name="real_password"
                    className="form-control premium-input" 
                    placeholder="Enter password"
                    autoComplete="new-password"
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none" }}>
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary w-100 py-3 mt-2" 
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>
              </form>

              <div className="text-center mt-5">
                <p className="mb-0 text-muted">
                  Don't have an NGO account? <br/>
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Register your Organization
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;