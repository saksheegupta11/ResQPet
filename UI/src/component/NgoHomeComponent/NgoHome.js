import './NgoHome.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { rescueApi } from '../../apiurl';
import { motion } from 'framer-motion';
import { Activity, Bell, CheckCircle, Shield, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function NgoHome() {
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [name, setName] = useState(localStorage.getItem('name'));

    useEffect(() => {
        const ngoId = localStorage.getItem('_id');
        const role = localStorage.getItem('role');
        const ngoCity = localStorage.getItem('city') || '';
        
        const queryParams = role === 'ngo' ? `?role=ngo&ngoId=${ngoId}&city=${ngoCity}` : '';

        axios.get(rescueApi + "fetch" + queryParams).then((response) => {
            const data = response.data.rescue;
            const myId = String(localStorage.getItem('_id') || '');
            
            setStats({
                total: data.filter(r => String(r.assignedNgo?._id || r.assignedNgo || '') === myId).length,
                pending: data.filter(r => r.status === 'pending').length, // New Alerts
                active: data.filter(r => r.status === 'accepted' && String(r.assignedNgo?._id || r.assignedNgo || '') === myId).length, // My Open Cases
                completed: data.filter(r => r.status === 'resolved' && String(r.assignedNgo?._id || r.assignedNgo || '') === myId).length // My Success Stories
            });
        }).catch(err => console.error("❌ Stats Fetch Error:", err));
    }, []);

    const statCards = [
        { id: 1, label: "New Alerts", value: stats.pending, icon: <Bell size={24} />, color: "#f59e0b" },
        { id: 2, label: "Open Cases", value: stats.active, icon: <Activity size={24} />, color: "#3b82f6" },
        { id: 3, label: "Rescues Completed", value: stats.completed, icon: <CheckCircle size={24} />, color: "#10b981" }
    ];

    return (
        <main className="dashboard-page section-padding">
            <div className="container">
                <motion.div 
                    className="dashboard-header mb-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <span className="badge-nature">NGO PARTNER</span>
                    <h2 className="display-6 fw-bold">Welcome back, {name}!</h2>
                    <p className="text-muted">You are making a difference in the lives of animals every day.</p>
                </motion.div>

                <div className="row g-4 mb-5">
                    {statCards.map((card, index) => (
                        <div className="col-lg-4" key={card.id}>
                            <motion.div 
                                className="premium-card glass"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="d-flex align-items-center mb-3">
                                    <div className="stat-icon-dashboard" style={{ background: `${card.color}20`, color: card.color }}>
                                        {card.icon}
                                    </div>
                                    <span className="ms-auto text-muted fw-bold">My Stats</span>
                                </div>
                                <h3 className="display-5 fw-bold mb-1">{card.value}</h3>
                                <p className="mb-0 text-muted">{card.label}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    <div className="col-lg-7">
                        <div className="premium-card glass h-100">
                            <h4 className="mb-4 d-flex align-items-center">
                                <Shield className="me-2 text-primary" /> Active Assignments
                            </h4>
                            <div className="dashboard-welcome-box p-4 rounded-4 mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                                <h5>New Cases Available</h5>
                                <p className="mb-0 opacity-75">There are {stats.pending} rescue requests assigned to your location. Every minute counts for a stray in distress.</p>
                                <Link to="/managereq" className="btn btn-light mt-3 text-primary fw-bold">
                                    View Requests <ArrowRight size={18} className="ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="premium-card glass h-100 d-flex flex-column align-items-center justify-content-center text-center p-5">
                            <div className="icon-circle mb-4">
                                <Heart size={48} className="text-danger" fill="currentColor" />
                            </div>
                            <h4>Join the Conversation</h4>
                            <p className="text-muted small">Connect with other rescuers and share your success stories on our community forum.</p>
                            <a href="https://www.reddit.com/r/AnimalRescue/" target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 w-100 text-decoration-none d-inline-block">Community Forum</a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default NgoHome;