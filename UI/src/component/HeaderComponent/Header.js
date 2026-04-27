import './Header.css';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Mail } from 'lucide-react';

function Header() {
    const [role, setRole] = useState(localStorage.getItem('role'));
    const { theme } = useTheme();

    useEffect(() => {
        const checkRole = () => {
            const currentRole = localStorage.getItem('role');
            if (currentRole !== role) {
                setRole(currentRole);
            }
        };
        const interval = setInterval(checkRole, 1000);
        return () => clearInterval(interval);
    }, [role]);

    const getDashboardLabel = () => {
        if (role === 'ngo') return 'NGO Dashboard';
        if (role === 'admin') return 'Admin Dashboard';
        return 'ResQPet Centre, Indore';
    };

    return (
        <header className="top-bar glass py-2">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8 col-12 d-flex flex-wrap gap-4">
                        <div className="d-flex align-items-center top-info">
                            <MapPin size={16} className="me-2 text-primary" />
                            <span>{getDashboardLabel()}</span>
                        </div>

                        <div className="d-flex align-items-center top-info">
                            <Mail size={16} className="me-2 text-primary" />
                            <a href="mailto:ResQPet@gmail.com" className="text-decoration-none transition-text">
                                ResQPet@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-4 col-12 d-none d-lg-flex justify-content-end gap-3 align-items-center">
                        <a href="#" className="social-icon-premium" title="Twitter"><i className="bi bi-twitter"></i></a>
                        <a href="#" className="social-icon-premium" title="Facebook"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="social-icon-premium" title="Instagram"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="social-icon-premium" title="Youtube"><i className="bi bi-youtube"></i></a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;