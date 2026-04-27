import './ManageNgo.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ngoApi } from '../../apiurl';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';

function Managengo() {
    const navigate = useNavigate();
    const [ngoDetail, setNgoDetail] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchNGOs = () => {
        axios.get(ngoApi + "fetch?role=ngo").then((response) => {
            setNgoDetail(response.data.ngo);
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchNGOs();
    }, []);

    const changeStatus = (_id, s) => {
        let updateDetail;
        if (s === 'verify') {
            updateDetail = { "condition_obj": { "_id": _id }, "content_obj": { "status": 1 } };
        } else if (s === 'block') {
            updateDetail = { "condition_obj": { "_id": _id }, "content_obj": { "status": 0 } };
        } else {
            axios.delete(ngoApi + "delete", { data: { "_id": _id } }).then(() => {
                fetchNGOs();
            });
            return;
        }

        axios.patch(ngoApi + "update", updateDetail).then(() => {
            fetchNGOs();
        }).catch(err => console.error(err));
    };

    const filteredNGOs = ngoDetail.filter(ngo => {
        const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              ngo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              ngo.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === "all" || 
                              (filterStatus === "pending" && ngo.status === 0) ||
                              (filterStatus === "approved" && ngo.status === 1);
        
        return matchesSearch && matchesFilter;
    });

    return (
        <main className="dashboard-page section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <motion.div 
                            className="premium-card glass p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="d-flex flex-column flex-md-row align-items-center mb-5 gap-3">
                                <div className="me-auto">
                                    <h3 className="fw-bold mb-1">Partner NGOs</h3>
                                    <p className="text-muted mb-0">Manage and verify rescue organizations across cities.</p>
                                </div>
                                <div className="search-box-premium glass d-flex align-items-center px-3 py-2 rounded-pill">
                                    <Search size={18} className="text-muted me-2" />
                                    <input 
                                        type="text" 
                                        placeholder="Search name, city or email..." 
                                        className="border-0 bg-transparent text-main"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ outline: "none", minWidth: "250px" }}
                                    />
                                </div>
                                <select 
                                    className="form-select border-0 glass rounded-pill px-4 text-main"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                    style={{ width: "160px", height: "45px" }}
                                >
                                    <option value="all">All NGOs</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>

                            <div className="table-responsive-modern">
                                <table className="table table-hover align-middle custom-table">
                                    <thead>
                                        <tr>
                                            <th>NGO Profile</th>
                                            <th>Contact Info</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <AnimatePresence>
                                        <tbody>
                                            {filteredNGOs.map((row) => (
                                                <motion.tr 
                                                    key={row._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="ngo-avatar-sm me-3">
                                                                {row.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0 fw-bold">{row.name}</h6>
                                                                <small className="text-muted">ID: #{row._id}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column">
                                                            <small className="d-flex align-items-center text-muted"><Mail size={12} className="me-1" /> {row.email}</small>
                                                            <small className="d-flex align-items-center text-muted"><Phone size={12} className="me-1" /> {row.mobile}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <small className="d-flex align-items-center text-capitalize text-muted">
                                                            <MapPin size={12} className="me-1" /> {row.city}, {row.pincode}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {row.status === 0 ? (
                                                            <span className="badge-nature-warning">Pending</span>
                                                        ) : (
                                                            <span className="badge-nature-success">Approved</span>
                                                        )}
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            {row.status === 0 ? (
                                                                <button className="btn-icon-success" title="Approve" onClick={() => changeStatus(row._id, 'verify')}>
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            ) : (
                                                                <button className="btn-icon-warning" title="Block" onClick={() => changeStatus(row._id, 'block')}>
                                                                    <XCircle size={18} />
                                                                </button>
                                                            )}
                                                            <button className="btn-icon-danger" title="Delete" onClick={() => changeStatus(row._id, 'delete')}>
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </AnimatePresence>
                                </table>
                                {filteredNGOs.length === 0 && (
                                    <div className="text-center py-5">
                                        <Search size={48} className="text-muted mb-3 opacity-25" />
                                        <p className="text-muted">No NGOs match your search criteria.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Managengo;