import './Register.css';
import { useState } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Info, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [output, setOutput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userDetail = { name, email, password, mobile, address, city, pincode };

    axios.post(ngoApi + "save", userDetail)
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          setIsSuccess(true);
          setOutput("Registration Successful! Your account is pending admin approval.");
          setName(""); setEmail(""); setPassword(""); setMobile("");
          setAddress(""); setCity(""); setPincode("");
        } else {
          setOutput("Registration failed. Email might already be registered.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setOutput("An error occurred during registration. Please try again.");
      });
  };

  return (
    <section className="auth-page section-padding py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div 
              className="premium-card glass p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="auth-header text-center mb-5">
                <div className="auth-icon-wrapper mb-3">
                  <ShieldCheck size={40} className="text-primary" />
                </div>
                <h2>Register Your NGO</h2>
                <p className="text-muted">Join our network and start receiving rescue requests</p>
              </div>

              {output && (
                <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} glass mb-4 d-flex align-items-center`}>
                  {isSuccess ? <CheckCircle size={20} className="me-2" /> : <Info size={20} className="me-2" />}
                  <span>{output}</span>
                </div>
              )}

              {!isSuccess && (
                <form onSubmit={handleSubmit}>
                  {/* Dummy hidden fields to distract browser autofill */}
                  <input type="text" name="email" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />
                  <input type="password" name="password" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><User size={18} className="me-2 text-primary" /> NGO Name</label>
                      <input type="text" name="ngo_name" className="form-control premium-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your organization's legal name" autoComplete="off" />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><Mail size={18} className="me-2 text-primary" /> Email Address</label>
                      <input type="email" name="email" className="form-control premium-input" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><Lock size={18} className="me-2 text-primary" /> Password</label>
                      <input type="password" name="password" minLength={5} className="form-control premium-input" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter strong password" />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><Phone size={18} className="me-2 text-primary" /> Contact Number</label>
                      <input type="tel" name="phone" maxLength={10} className="form-control premium-input" value={mobile} onChange={e => setMobile(e.target.value)} required placeholder="Enter 10-digit mobile number" autoComplete="off" />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="mb-2 d-flex align-items-center"><MapPin size={18} className="me-2 text-primary" /> Full Office Address</label>
                    <textarea className="form-control premium-input" rows="2" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Building, Street, Area..." autoComplete="off"></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><MapPin size={18} className="me-2 text-primary" /> City</label>
                      <select className="form-control premium-input" value={city} onChange={e => setCity(e.target.value)} required>
                        <option value="">Select City</option>
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Jabalpur">Jabalpur</option>
                        <option value="Ujjain">Ujjain</option>
                        <option value="Sagar">Sagar</option>
                        <option value="Dewas">Dewas</option>
                        <option value="Satna">Satna</option>
                        <option value="Ratlam">Ratlam</option>
                        <option value="Rewa">Rewa</option>
                        <option value="Katni">Katni</option>
                        <option value="Singrauli">Singrauli</option>
                        <option value="Burhanpur">Burhanpur</option>
                        <option value="Khandwa">Khandwa</option>
                        <option value="Sidhi">Sidhi</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="mb-2 d-flex align-items-center"><MapPin size={18} className="me-2 text-primary" /> Pincode</label>
                      <input type="text" maxLength={6} className="form-control premium-input" value={pincode} onChange={e => setPincode(e.target.value)} required placeholder="6-digit ZIP" />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-100 py-3 mt-3" disabled={loading}>
                    {loading ? "Registering..." : "Create NGO Account"}
                  </button>
                </form>
              )}

              {isSuccess && (
                <div className="text-center mt-4">
                  <Link to="/login" className="btn-primary d-inline-block text-decoration-none">
                    Go to Login
                  </Link>
                </div>
              )}

              <div className="text-center mt-5">
                <p className="mb-0 text-muted">
                  Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;