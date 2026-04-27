import './ChangePass.css';
import { useState } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert } from 'lucide-react';

function ChangePass() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [output, setOutput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem('email');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setOutput("New passwords do not match.");
      return;
    }

    setLoading(true);
    // In this simplified system, we'll verify the old password via a fetch then update.
    // Ideally, there should be a dedicated 'changepassword' route on backend.
    axios.post(ngoApi + "login", { email, password: oldPassword })
      .then(() => {
        const updateDetail = { 
          "condition_obj": { "email": email }, 
          "content_obj": { "password": newPassword } 
        };
        return axios.patch(ngoApi + "update", updateDetail);
      })
      .then(() => {
        setLoading(false);
        setOutput("Password updated successfully!");
        setTimeout(() => navigate("/admin"), 1500);
      })
      .catch((err) => {
        setLoading(false);
        setOutput("Invalid old password or server error.");
      });
  };

  return (
    <section className="dashboard-page section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <motion.div 
              className="premium-card glass p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-5">
                <div className="icon-circle mb-3 mx-auto" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)'}}>
                  <Lock size={32} />
                </div>
                <h2 className="fw-bold">Security</h2>
                <p className="text-muted small">Update your account password regularly</p>
              </div>

              {output && (
                <div className={`alert ${output.includes('successfully') ? 'alert-success' : 'alert-danger'} glass d-flex align-items-center mb-4`}>
                   {output.includes('successfully') ? <CheckCircle size={18} className="me-2" /> : <ShieldAlert size={18} className="me-2" />}
                   <small>{output}</small>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label className="mb-2 d-flex align-items-center small fw-bold">Old Password</label>
                  <div className="position-relative">
                    <input 
                      type={showPass ? "text" : "password"} 
                      className="form-control premium-input" 
                      value={oldPassword} 
                      onChange={e => setOldPassword(e.target.value)} 
                      required 
                    />
                    <button type="button" className="btn-input-icon" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <hr className="my-4 opacity-10" />

                <div className="form-group mb-4">
                  <label className="mb-2 d-flex align-items-center small fw-bold">New Password</label>
                  <input type="password" minLength={5} className="form-control premium-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>

                <div className="form-group mb-4">
                  <label className="mb-2 d-flex align-items-center small fw-bold">Confirm New Password</label>
                  <input type="password" className="form-control premium-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>

                <button type="submit" className="btn-primary w-100 py-3 mt-2" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChangePass;
