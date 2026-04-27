import './Login.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(180); // 3 Minutes

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setError("OTP Expired. Please request a new one.");
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        axios.post(ngoApi + "forgot-password", { email })
            .then(res => {
                setStep(2);
                setMessage(res.data.result);
                setTimer(180);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.result || "Email not found");
                setLoading(false);
            });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        axios.post(ngoApi + "verify-otp", { email, otp })
            .then(res => {
                setStep(3);
                setMessage(res.data.result);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.result || "Invalid or expired OTP");
                setLoading(false);
            });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 5) {
            setError("Password must be at least 5 characters long");
            return;
        }

        setLoading(true);
        setError("");

        axios.post(ngoApi + "reset-password", { email, otp, newPassword })
            .then(res => {
                setStep(4); // Success step
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.result || "Reset failed. Try again.");
                setLoading(false);
            });
    };

    return (
        <section className="auth-page section-padding d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8 col-12">
                        <motion.div 
                            className="premium-card glass p-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="auth-header text-center mb-5">
                                <h2 className="fw-bold">Account Recovery</h2>
                                <p className="text-muted">Securely reset your password in 3 easy steps</p>
                                
                                <div className="step-indicator-dots mt-4">
                                    <div className={`dot ${step >= 1 ? 'active' : ''}`}></div>
                                    <div className={`dot ${step >= 2 ? 'active' : ''}`}></div>
                                    <div className={`dot ${step >= 3 ? 'active' : ''}`}></div>
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger glass d-flex align-items-center mb-4">
                                    <AlertCircle size={18} className="me-2" />
                                    <small>{error}</small>
                                </div>
                            )}

                            {message && step < 4 && (
                                <div className="alert alert-success glass d-flex align-items-center mb-4">
                                    <CheckCircle2 size={18} className="me-2" />
                                    <small>{message}</small>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.form 
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleSendOtp}
                                    >
                                        <div className="form-group mb-4">
                                            <label className="mb-2 d-flex align-items-center"><Mail size={18} className="me-2 text-primary" /> Registered Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control premium-input" 
                                                placeholder="Enter your email" 
                                                required 
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button className="btn-primary w-100 py-3" disabled={loading}>
                                            {loading ? "Checking..." : "Send OTP"} <ArrowRight size={18} className="ms-2" />
                                        </button>
                                    </motion.form>
                                )}

                                {step === 2 && (
                                    <motion.form 
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleVerifyOtp}
                                    >
                                        <div className="form-group mb-4">
                                            <label className="mb-2 d-flex align-items-center"><ShieldCheck size={18} className="me-2 text-primary" /> Enter 6-Digit OTP</label>
                                            <input 
                                                type="text" 
                                                maxLength="6"
                                                className="form-control premium-input text-center fw-bold" 
                                                style={{ letterSpacing: '10px', fontSize: '24px' }}
                                                placeholder="000000" 
                                                required 
                                                value={otp}
                                                onChange={e => setOtp(e.target.value)}
                                            />
                                            <div className="text-center mt-3">
                                                <small className={timer < 30 ? 'text-danger fw-bold' : 'text-muted'}>
                                                    Expires in: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                                </small>
                                            </div>
                                        </div>
                                        <button className="btn-primary w-100 py-3 mb-3" disabled={loading || timer === 0}>
                                            {loading ? "Verifying..." : "Verify OTP"}
                                        </button>
                                        <button type="button" className="btn btn-link w-100 text-decoration-none text-muted" onClick={() => setStep(1)}>
                                            <ArrowLeft size={16} className="me-1" /> Use different email
                                        </button>
                                    </motion.form>
                                )}

                                {step === 3 && (
                                    <motion.form 
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleResetPassword}
                                    >
                                        <div className="form-group mb-4">
                                            <label className="mb-2 d-flex align-items-center"><KeyRound size={18} className="me-2 text-primary" /> New Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control premium-input" 
                                                placeholder="Min 5 characters" 
                                                required 
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mb-4">
                                            <label className="mb-2 d-flex align-items-center"><KeyRound size={18} className="me-2 text-primary" /> Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control premium-input" 
                                                placeholder="Repeat matching password" 
                                                required 
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <button className="btn-primary w-100 py-3" disabled={loading}>
                                            {loading ? "Resetting..." : "Update Password"}
                                        </button>
                                    </motion.form>
                                )}

                                {step === 4 && (
                                    <motion.div 
                                        key="step4"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-4"
                                    >
                                        <div className="mb-4">
                                            <CheckCircle2 size={64} className="text-success" />
                                        </div>
                                        <h3 className="fw-bold">All Set!</h3>
                                        <p className="text-muted">Your password has been successfully updated. You can now login with your new credentials.</p>
                                        <Link to="/login" className="btn btn-primary w-100 py-3 mt-4">
                                            Go to Login
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {step < 4 && (
                                <div className="text-center mt-5">
                                    <Link to="/login" className="text-primary text-decoration-none small fw-bold">
                                        Back to Login
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
