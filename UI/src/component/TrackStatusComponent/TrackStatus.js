import React, { useState } from 'react';
import axios from 'axios';
import { rescueApi } from '../../apiurl';
import { Search, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TrackStatus.css';

function TrackStatus() {
    const [identifier, setIdentifier] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResults(null);

        // Search by email or mobile
        const query = identifier.includes('@') ? `reporterEmail=${identifier}` : `mobile=${identifier}`;
        
        axios.get(`${rescueApi}fetch?${query}`)
            .then(res => {
                setLoading(false);
                if (res.data.rescue && res.data.rescue.length > 0) {
                    setResults(res.data.rescue);
                } else {
                    setError("No requests found with this information.");
                }
            })
            .catch(err => {
                setLoading(false);
                setError("An error occurred while fetching. Please try again.");
                console.error(err);
            });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="text-success" />;
            case 'resolved': return <CheckCircle className="text-primary" />;
            default: return <Clock className="text-warning" />;
        }
    };

    return (
        <main className="track-page section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <motion.div 
                            className="premium-card glass p-5 text-center mb-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="display-6 fw-bold mb-3">Track Your Request</h2>
                            <p className="text-muted mb-4">Enter your registered mobile number or email to check the current status of your reports.</p>
                            
                            <form onSubmit={handleSearch} className="search-form-premium">
                                <div className="input-group-premium glass d-flex align-items-center px-4 py-2 rounded-pill">
                                    <Search size={20} className="text-muted me-3" />
                                    <input 
                                        type="text" 
                                        placeholder="Enter Email or 10-digit Mobile..." 
                                        className="border-0 bg-transparent flex-grow-1 py-2 text-main"
                                        value={identifier}
                                        onChange={e => setIdentifier(e.target.value)}
                                        required
                                        style={{ outline: 'none' }}
                                    />
                                    <button type="submit" className="btn-primary btn-sm rounded-pill px-4 ms-2" disabled={loading}>
                                        {loading ? "Searching..." : "Track"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    className="alert alert-danger glass d-flex align-items-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <AlertCircle size={20} className="me-2" />
                                    {error}
                                </motion.div>
                            )}

                            {results && (
                                <motion.div 
                                    className="results-container mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <h4 className="fw-bold mb-4">Found {results.length} Request(s)</h4>
                                    {results.map((res, index) => (
                                        <motion.div 
                                            key={res._id}
                                            className="status-card premium-card glass p-4 mb-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="d-flex flex-column flex-md-row gap-4 align-items-center">
                                                <div className="res-img-thumb">
                                                    <img 
                                                        src={`/assests/upload/petimages/${res.animalImage || res.animalImageName}`} 
                                                        alt="Rescue" 
                                                        className="rounded-4"
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200'}
                                                    />
                                                </div>
                                                <div className="flex-grow-1 text-md-start">
                                                    <div className="d-flex align-items-center gap-2 mb-2 justify-content-center justify-content-md-start">
                                                        {getStatusIcon(res.status)}
                                                        <span className={`status-text fw-bold text-uppercase small ${res.status}`}>
                                                            {res.status === 'pending' && !res.assignedNgo ? "Searching for NGO" : res.status}
                                                        </span>
                                                    </div>
                                                    <h5 className="fw-bold mb-1"><MapPin size={16} className="me-1 text-primary" /> {res.location}, {res.city}</h5>
                                                    <p className="text-muted small mb-3">{res.description}</p>
                                                    
                                                    <div className="info-strip d-flex flex-wrap gap-4 small justify-content-center justify-content-md-start">
                                                        <span className="d-flex align-items-center"><Calendar size={14} className="me-1" /> {new Date(res.createdAt).toLocaleDateString()}</span>
                                                        {res.assignedNgo && (
                                                            <span className="d-flex align-items-center text-primary fw-bold">
                                                                <User size={14} className="me-1" /> {res.assignedNgo.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {res.assignedNgo && (
                                                    <div className="contact-box border-start ps-md-4">
                                                        <p className="text-muted small mb-1">Assigned NGO Contact</p>
                                                        <a href={`tel:${res.assignedNgo.mobile}`} className="text-decoration-none fw-bold d-flex align-items-center phone-link">
                                                            <Phone size={16} className="me-2 text-primary" /> {res.assignedNgo.mobile}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TrackStatus;
