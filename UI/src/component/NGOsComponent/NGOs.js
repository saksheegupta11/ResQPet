import './NGOs.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

function NGOs() {
    const [ngoList, setNgoList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("all");

    useEffect(() => {
        axios.get(ngoApi + "fetch?role=ngo&status=1").then((response) => {
            setNgoList(response.data.ngo);
        }).catch(err => console.error(err));
    }, []);

    const filteredNGOs = ngoList.filter(ngo => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              ngo.city.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = cityFilter === "all" || ngo.city === cityFilter;
        return matchesSearch && matchesCity;
    });

    return (
        <main className="section-padding bg-alt-nature">
            <div className="container">
                <motion.div 
                    className="text-center mb-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="badge-nature mb-2">PARTNER NETWORK</span>
                    <h2 className="display-4 fw-bold">Verified Rescue <span className="text-gradient">Partners</span></h2>
                    <p className="text-muted lead">Connecting you with the most dedicated animal welfare organizations in your city.</p>
                </motion.div>

                <div className="glass p-4 rounded-4 mb-5">
                    <div className="row g-3 align-items-center">
                        <div className="col-lg-8">
                            <div className="search-box-premium glass d-flex align-items-center px-3 py-2 rounded-pill">
                                <Search size={20} className="text-muted me-2" />
                                <input 
                                    type="text" 
                                    placeholder="Search by NGO name or city..." 
                                    className="border-0 bg-transparent w-100 py-1"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ outline: "none", color: "var(--text-main)" }}
                                />
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <select 
                                className="form-select border-0 glass rounded-pill px-4"
                                value={cityFilter}
                                onChange={e => setCityFilter(e.target.value)}
                                style={{ height: "48px", color: "var(--text-main)", background: "var(--surface)" }}
                            >
                                <option value="all">Everywhere</option>
                                <option value="Indore">Indore</option>
                                <option value="Ujjain">Ujjain</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <AnimatePresence>
                        {filteredNGOs.map((ngo, index) => (
                            <div className="col-lg-4 col-md-6" key={ngo._id}>
                                <motion.div 
                                    className="premium-card h-100"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ translateY: -5 }}
                                >
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="ngo-avatar-lg me-3">
                                            {ngo.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">{ngo.name}</h5>
                                            <div className="d-flex align-items-center text-primary small">
                                                <ShieldCheck size={14} className="me-1" /> Verified Partner
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ngo-info-body mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <MapPin size={18} className="text-muted me-3" />
                                            <span className="text-muted">{ngo.address}, {ngo.city} {ngo.pincode}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Phone size={18} className="text-muted me-3" />
                                            <span className="text-muted fw-bold">{ngo.mobile}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                            <Mail size={18} className="text-muted me-3" />
                                            <span className="text-muted">{ngo.email}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto d-flex gap-2">
                                        <a href={`tel:${ngo.mobile}`} className="btn btn-outline-primary w-100 rounded-3 py-2">Call Now</a>
                                        <Link to="/rescue" className="btn btn-primary w-100 rounded-3 py-2">Report Case</Link>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredNGOs.length === 0 && (
                    <div className="text-center py-5">
                        <div className="glass p-5 rounded-5 d-inline-block">
                            <ExternalLink size={64} className="text-muted mb-4 opacity-25" />
                            <h4>No NGOs Found in this City</h4>
                            <p className="text-muted mb-0">Try searching for Indore or Ujjain.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default NGOs;