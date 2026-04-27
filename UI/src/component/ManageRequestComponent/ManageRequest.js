import './ManageRequest.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { rescueApi } from '../../apiurl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Calendar, Mail, ExternalLink, Filter, Activity, Heart } from 'lucide-react';

function ManageRequest() {
    const [rescueDetail, setRescueDetail] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("all");
    const [role] = useState((localStorage.getItem('role') || '').toLowerCase());
    const [ngoId] = useState(localStorage.getItem('_id'));
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ id: null, action: '', message: '' });

    const fetchRequests = () => {
        const currentNgoId = localStorage.getItem('_id');
        const role = localStorage.getItem('role');
        const ngoCity = localStorage.getItem('city') || '';
        
        console.log(`📡 Fetching requests for Role: ${role}, ID: ${currentNgoId}, City: ${ngoCity}`);
        
        const queryParams = role === 'ngo' ? `?role=ngo&ngoId=${currentNgoId}&city=${ngoCity}` : '';
        console.log(`🔗 Requesting: ${rescueApi}fetch${queryParams}`);
        
        axios.get(rescueApi + "fetch" + queryParams).then((response) => {
            const data = response.data.rescue;
            console.log("📦 Received Requests:", data.length);
            if (data.length > 0) {
                console.log("💡 First Request assignedNgo:", data[0].assignedNgo);
                console.log("🆔 My NGO ID:", currentNgoId);
            }
            setRescueDetail(data);
        }).catch(err => console.error("❌ Fetch Error:", err));
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const triggerAction = (id, action) => {
        const messages = {
            accept: "Are you ready to take responsibility for this rescue? This will move to your 'Open Cases'.",
            reject: "Are you sure you want to reject this? It will be re-assigned to another nearby NGO.",
            resolve: "Amazing work! Has the animal been safely rescued and secured?"
        };
        
        setModalConfig({ id, action, message: messages[action] });
        setShowModal(true);
    };

    const confirmAction = () => {
        const { id, action } = modalConfig;
        const updateData = {
            condition_obj: { _id: id },
            content_obj: { 
                action: action,
                // If accepting, we must link this NGO to the request
                assignedNgo: action === 'accept' ? Number(ngoId) : undefined 
            }
        };
        
        setShowModal(false);

        axios.patch(rescueApi + "update", updateData).then((res) => {
            console.log("🚀 Update Response:", res.data);
            // Optimistic update for better UX
            setRescueDetail(prev => prev.map(r => r._id === id ? { ...r, status: res.data.status || action } : r));
            
            // Refetch to ensure everything is in sync
            setTimeout(fetchRequests, 1000);
        }).catch(err => {
            console.error("❌ Update Error:", err);
            alert("Action failed. Check console for details.");
        });
    };

    const cities = ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Sidhi"];

    const filteredRequests = rescueDetail.filter(req => {
        const matchesSearch = 
            (req.location?.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (req.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (req.mobile?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCity = cityFilter === "all" || req.city === cityFilter;
        
        return matchesSearch && matchesCity;
    });

    return (
        <main className="dashboard-page section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <motion.div 
                            className="premium-card glass p-4"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="d-flex flex-column flex-md-row align-items-center mb-5 gap-3">
                                <div className="me-auto">
                                    <h3 className="fw-bold mb-1">Rescue Requests</h3>
                                    <p className="text-muted mb-0">Monitor and respond to emergency reports.</p>
                                </div>
                                <div className="search-box-premium glass d-flex align-items-center px-3 py-2 rounded-pill">
                                    <Search size={18} className="text-muted me-2" />
                                    <input 
                                        type="text" 
                                        placeholder="Search location or info..." 
                                        className="border-0 bg-transparent text-main"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ outline: "none", minWidth: "200px" }}
                                    />
                                </div>
                                <select 
                                    className="form-select border-0 glass rounded-pill px-4 text-main"
                                    value={cityFilter}
                                    onChange={e => setCityFilter(e.target.value)}
                                    style={{ width: "200px", height: "45px" }}
                                >
                                    <option value="all">All Cities (M.P.)</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>

                            <div className="row g-4">
                                <AnimatePresence>
                                    {filteredRequests.map((req, index) => (
                                        <div className="col-lg-6 col-xl-4" key={req._id}>
                                            <motion.div 
                                                className="rescue-request-card premium-card h-100"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <div className="req-img-box mb-3">
                                                    <img 
                                                        src={`/assests/upload/petimages/${req.animalImage || req.animalImageName}`} 
                                                        alt="Animal in Distress" 
                                                        className="img-fluid rounded-4" 
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400';
                                                        }}
                                                    />
                                                    <div className={`req-status-badge ${req.status}`}>
                                                        {req.status === 'pending' && !req.assignedNgo ? "UNASSIGNED" : req.status?.toUpperCase() || "NEW"}
                                                    </div>
                                                </div>
                                                
                                                <div className="d-flex align-items-center mb-3">
                                                    <small className="text-primary fw-bold d-flex align-items-center">
                                                        <MapPin size={14} className="me-1" /> {req.city || "Unknown City"}
                                                    </small>
                                                    <small className="ms-auto text-muted d-flex align-items-center">
                                                        <Calendar size={14} className="me-1" /> {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                                                    </small>
                                                </div>

                                                <h5 className="fw-bold mb-2">Location: {req.location}</h5>
                                                {role === 'admin' && (
                                                    <div className="admin-info-badge mb-2 d-inline-block">
                                                        <small className="text-dark bg-light px-2 py-1 rounded-pill border">
                                                            Assigned: <span className="fw-bold text-primary">{req.assignedNgo?.name || "None / Alert Sent"}</span>
                                                        </small>
                                                    </div>
                                                )}
                                                <p className="text-muted small mb-4 line-clamp-2">{req.description || "No description provided."}</p>
                                                
                                                <div className="contact-info-strip glass p-3 rounded-4 mb-4">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <Phone size={14} className="text-primary me-2" />
                                                        <span className="small fw-bold">{req.mobile}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <Mail size={14} className="text-primary me-2" />
                                                        <span className="small opacity-75">{req.reporterEmail || "Anonymous"}</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-wrap gap-2 mt-auto">
                                                    <a href={`https://www.google.com/maps?q=${encodeURIComponent(req.location)}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary flex-grow-1 py-2 rounded-pill d-flex align-items-center justify-content-center">
                                                        <MapPin size={16} className="me-2" /> {req.status === 'resolved' ? 'Viewed' : 'Maps'}
                                                    </a>
                                                    
                                                    {role === 'ngo' && (
                                                        <div className="d-flex flex-column gap-2 w-100 mt-2">
                                                            {req.status === 'pending' ? (
                                                                <div className="d-flex gap-2 w-100">
                                                                    <button 
                                                                        onClick={() => triggerAction(req._id, 'accept')}
                                                                        className="btn btn-sm btn-success flex-grow-1 py-2 rounded-pill fw-bold"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => triggerAction(req._id, 'reject')}
                                                                        className="btn btn-sm btn-danger flex-grow-1 py-2 rounded-pill fw-bold"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {req.status === 'accepted' && (
                                                                        String(req.assignedNgo?._id || req.assignedNgo || '') === String(ngoId) ? (
                                                                            <button 
                                                                                onClick={() => triggerAction(req._id, 'resolve')}
                                                                                className="btn btn-sm btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm"
                                                                                style={{ animation: 'pulse 2s infinite' }}
                                                                            >
                                                                                Mark as Rescued ✅
                                                                            </button>
                                                                        ) : (
                                                                            <div className="d-flex gap-2 w-100">
                                                                                <button className="btn btn-sm btn-light flex-grow-1 py-2 rounded-pill text-muted border" disabled>
                                                                                    Accept
                                                                                </button>
                                                                                <button className="btn btn-sm btn-light flex-grow-1 py-2 rounded-pill text-muted border" disabled>
                                                                                    Reject
                                                                                </button>
                                                                            </div>
                                                                        )
                                                                    )}

                                                                    {req.status === 'resolved' && String(req.assignedNgo?._id || req.assignedNgo || '') === String(ngoId) && (
                                                                        <button className="btn btn-sm btn-outline-success w-100 py-2 rounded-pill fw-bold" disabled>
                                                                            Rescued successfully! 🐾
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </div>
                                    ))}
                                </AnimatePresence>
                                
                                {filteredRequests.length === 0 && (
                                    <div className="col-12 text-center py-5">
                                        <div className="glass p-5 rounded-5 d-inline-block">
                                            <ExternalLink size={64} className="text-muted mb-3 opacity-25" />
                                            <h5>No Requests Found</h5>
                                            <p className="text-muted mb-0">Check back later for new alerts.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Custom Premium Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        className="custom-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="custom-modal-content glass p-5 text-center"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="modal-icon-box mb-4">
                                {modalConfig.action === 'accept' && <Activity size={48} className="text-success" />}
                                {modalConfig.action === 'reject' && <ExternalLink size={48} className="text-danger" />}
                                {modalConfig.action === 'resolve' && <Heart size={48} className="text-primary" />}
                            </div>
                            <h3 className="fw-bold mb-3">Wait a moment...</h3>
                            <p className="text-muted mb-4">{modalConfig.message}</p>
                            <div className="d-flex gap-3">
                                <button className="btn btn-secondary flex-grow-1 py-3 rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary flex-grow-1 py-3 rounded-pill fw-bold" onClick={confirmAction}>Yes, Confirm</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default ManageRequest;