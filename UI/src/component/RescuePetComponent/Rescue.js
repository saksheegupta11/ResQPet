import './Rescue.css';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Send, Mail, Phone, Info } from 'lucide-react';
import axios from 'axios';
import { rescueApi, ngoApi } from '../../apiurl';

function Rescue() {
    const [step, setStep] = useState(1);
    const [output, setOutput] = useState();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState("");
    const [assignedNgo, setAssignedNgo] = useState("");
    const [ngoName, setNgoName] = useState("");

    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("reporterEmail", email);
        formData.append("mobile", mobile);
        formData.append("location", location);
        formData.append("city", city);
        formData.append("animalImage", file);
        formData.append("description", description);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        axios.post(rescueApi + "save", formData, config)
            .then((response) => {
                if (response.data.status) {
                    setAssignedNgo(response.data.assignedNgo || "No NGO assigned");
                    setStep(3); // Success step
                } else {
                    setOutput("Submission failed. Please check your data.");
                }
            })
            .catch(() => setOutput("Server error. Try again later."));
    };

    useEffect(() => {
        if (assignedNgo && assignedNgo !== "No NGO assigned") {
            axios.get(`${ngoApi}fetch?email=${assignedNgo}`)
                .then(res => setNgoName(res.data.ngo[0]?.name || "NGO"))
                .catch(err => console.error(err));
        }
    }, [assignedNgo]);

    return (
        <section className="section-padding rescue-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div 
                            className="premium-card glass"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="wizard-header text-center mb-4">
                                <h2 className="brand-name">ResQPet Wizard</h2>
                                <p className="text-muted">Quick reporting saves lives. Follow the steps below.</p>
                                <div className="step-indicator">
                                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                                    <div className="step-line"></div>
                                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                                    <div className="step-line"></div>
                                    <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div 
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div className="form-group mb-4">
                                            <label className="d-flex align-items-center mb-2">
                                                <Camera className="me-2 text-primary" size={20} /> Upload Animal Image
                                            </label>
                                            <div 
                                                className="image-upload-zone"
                                                onClick={() => fileInputRef.current.click()}
                                                style={{ backgroundImage: `url(${preview})` }}
                                            >
                                                {!preview && (
                                                    <div className="upload-placeholder">
                                                        <Camera size={48} className="text-muted mb-2" />
                                                        <p>Click to upload or take a photo</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input 
                                                type="file" 
                                                hidden 
                                                ref={fileInputRef} 
                                                onChange={handleFileChange} 
                                                accept="image/*"
                                            />
                                        </div>

                                        <div className="form-group mb-4">
                                            <label className="d-flex align-items-center mb-2">
                                                <Info className="me-2 text-primary" size={20} /> Description
                                            </label>
                                            <textarea 
                                                className="form-control premium-input" 
                                                rows="3"
                                                placeholder="What is the animal's condition?"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <button 
                                            className="btn-primary w-100" 
                                            disabled={!file}
                                            onClick={() => setStep(2)}
                                        >
                                            Next Step
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div 
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        {/* Dummy hidden fields to distract browser autofill */}
                                        <input type="email" name="email" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />
                                        <input type="tel" name="phone" style={{ display: 'none' }} tabIndex="-1" aria-hidden="true" />

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="mb-2 d-flex align-items-center"><Mail size={18} className="me-2 text-primary" /> Email</label>
                                                <input type="email" name="reporter_email" className="form-control premium-input" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="off" />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="mb-2 d-flex align-items-center"><Phone size={18} className="me-2 text-primary" /> Mobile</label>
                                                <input type="tel" name="reporter_phone" className="form-control premium-input" value={mobile} onChange={e => setMobile(e.target.value)} required autoComplete="off" />
                                            </div>
                                        </div>

                                        <div className="form-group mb-4">
                                            <label className="mb-2 d-flex align-items-center"><MapPin size={18} className="me-2 text-primary" /> Location Detail</label>
                                            <input type="text" name="location" className="form-control premium-input" placeholder="Nearby landmark, street, etc." value={location} onChange={e => setLocation(e.target.value)} required autoComplete="off" />
                                        </div>

                                        <div className="form-group mb-4">
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

                                        <div className="d-flex gap-3">
                                            <button className="btn-secondary w-50" onClick={() => setStep(1)}>Back</button>
                                            <button className="btn-primary w-50" onClick={handleSubmit}>Submit Rescue</button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div 
                                        key="step3"
                                        className="text-center py-4"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                    >
                                        <div className="success-icon mb-4">
                                            <Send size={64} className="text-primary" />
                                        </div>
                                        <h3>Request Sent Successfully!</h3>
                                        <div className="alert alert-info mt-4 glass">
                                            🐾 Assigned NGO: <strong>{ngoName}</strong><br/>
                                            Contact: <strong>{assignedNgo}</strong>
                                        </div>
                                        <button className="btn-primary mt-4" onClick={() => window.location.reload()}>Report Another Case</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {output && <div className="alert alert-danger mt-3">{output}</div>}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Rescue;