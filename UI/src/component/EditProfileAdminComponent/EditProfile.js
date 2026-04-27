import './EditProfile.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

function EditProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem('email');

    useEffect(() => {
        axios.get(ngoApi + "fetch?email=" + email).then((res) => {
            const data = res.data.ngo[0];
            if (data) {
                setName(data.name);
                setMobile(data.mobile);
                setAddress(data.address);
                setPincode(data.pincode);
                setCity(data.city);
            }
        }).catch(err => console.error(err));
    }, [email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const updateDetail = { 
            "condition_obj": { "email": email }, 
            "content_obj": { name, city, pincode, address, mobile } 
        };

        axios.patch(ngoApi + "update", updateDetail).then(() => {
            setLoading(false);
            setOutput("Profile updated successfully!");
            setTimeout(() => navigate("/admin"), 1500);
        }).catch((error) => {
            setLoading(false);
            console.error(error);
            setOutput("Update failed. Please try again.");
        });
    };

    return (
        <section className="dashboard-page section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <motion.div 
                            className="premium-card glass p-5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-center mb-5">
                                <div className="icon-circle mb-3 mx-auto">
                                    <User size={32} className="text-primary" />
                                </div>
                                <h2 className="fw-bold">Account Settings</h2>
                                <p className="text-muted small">Update your administrative profile information</p>
                            </div>

                            {output && (
                                <div className={`alert ${output.includes('successfully') ? 'alert-success' : 'alert-danger'} glass d-flex align-items-center mb-4`}>
                                    {output.includes('successfully') ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
                                    <small>{output}</small>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <label className="mb-2 d-flex align-items-center small fw-bold">
                                        <User size={16} className="me-2 text-primary" /> Full Name
                                    </label>
                                    <input type="text" className="form-control premium-input" value={name} onChange={e => setName(e.target.value)} required />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="mb-2 d-flex align-items-center small fw-bold">
                                        <Phone size={16} className="me-2 text-primary" /> Mobile Number
                                    </label>
                                    <input type="tel" className="form-control premium-input" value={mobile} onChange={e => setMobile(e.target.value)} required />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="mb-2 d-flex align-items-center small fw-bold">
                                        <MapPin size={16} className="me-2 text-primary" /> Office Address
                                    </label>
                                    <textarea className="form-control premium-input" rows="2" value={address} onChange={e => setAddress(e.target.value)} required></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="mb-2 d-flex align-items-center small fw-bold">City</label>
                                        <select className="form-control premium-input" value={city} onChange={e => setCity(e.target.value)} required>
                                            <option value="Indore">Indore</option>
                                            <option value="Ujjain">Ujjain</option>
                                            <option value="Dewas">Dewas</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="mb-2 d-flex align-items-center small fw-bold">Pincode</label>
                                        <input type="text" className="form-control premium-input" value={pincode} onChange={e => setPincode(e.target.value)} required />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-100 py-3 mt-3" disabled={loading}>
                                    {loading ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditProfile;