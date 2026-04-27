import './AdminHome.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { rescueApi, ngoApi } from '../../apiurl';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Activity, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminHome() {
    const [stats, setStats] = useState({ totalNgos: 0, activeNgos: 0, totalRescues: 0, unassigned: 0 });

    useEffect(() => {
        // Fetch NGO stats
        axios.get(ngoApi + "fetch?role=ngo").then((resNgo) => {
            const ngos = resNgo.data.ngo;
            // Fetch Rescue stats
            axios.get(rescueApi + "fetch").then((resRescue) => {
                const rescues = resRescue.data.rescue;
                setStats({
                    totalNgos: ngos.length,
                    activeNgos: ngos.filter(n => n.status === 1).length,
                    totalRescues: rescues.length,
                    unassigned: rescues.filter(r => r.status === 'pending' && !r.assignedNgo).length
                });
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
    }, []);

    const statCards = [
        { id: 1, label: "Total NGOs", value: stats.totalNgos, icon: <Users size={24} />, color: "var(--primary)" },
        { id: 2, label: "Total Rescues", value: stats.totalRescues, icon: <Activity size={24} />, color: "#3b82f6" },
        { id: 3, label: "Unassigned Cases", value: stats.unassigned, icon: <ShieldCheck size={24} />, color: "#ef4444" }
    ];

    return (
        <main className="dashboard-page section-padding">
            <div className="container">
                <motion.div 
                    className="dashboard-header mb-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <span className="badge-nature">ADMINISTRATOR</span>
                    <h2 className="display-6 fw-bold">System Overview</h2>
                    <p className="text-muted">Manage the ecosystem and monitor partner activities.</p>
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
                                    <span className="ms-auto text-muted fw-bold">Live Data</span>
                                </div>
                                <h3 className="display-5 fw-bold mb-1">{card.value}</h3>
                                <p className="mb-0 text-muted">{card.label}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="premium-card glass h-100">
                            <h4 className="mb-4 d-flex align-items-center">
                                <Award className="me-2 text-primary" /> Active Operations
                            </h4>
                            <div className="dashboard-welcome-box p-4 rounded-4 mb-4">
                                <h5>NGO Overview</h5>
                                <p className="mb-0 opacity-75">There are {stats.totalNgos - stats.activeNgos} new NGO registrations waiting for your review. Timely approval ensures faster animal rescues.</p>
                                <Link to="/managengo" className="btn btn-primary mt-3">
                                    Manage NGOs <ArrowRight size={18} className="ms-2" />
                                </Link>
                            </div>
                            <div className="dashboard-welcome-box p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                                <h5>Rescue Alert</h5>
                                <p className="mb-0 opacity-75">There are {stats.unassigned} help requests that couldn't be automatically assigned to any NGO. Action required.</p>
                                <Link to="/managereq" className="btn btn-light mt-3 text-danger fw-bold">
                                    Review Requests <ArrowRight size={18} className="ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AdminHome;
