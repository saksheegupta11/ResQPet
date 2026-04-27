import './Nav.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

function Nav() {
    const [role, setRole] = useState(localStorage.getItem('role'));
    const { theme, toggleTheme } = useTheme();

    // Update role check
    useEffect(() => {
        const checkRole = () => {
            const currentRole = localStorage.getItem('role');
            if (currentRole !== role) {
                setRole(currentRole);
            }
        };

        const interval = setInterval(checkRole, 500);
        return () => clearInterval(interval);
    }, [role]);

    return (
        <nav className="navbar navbar-expand-lg sticky-top nav-glass shadow-sm">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="./assests/images/logo.png" className="logo-premium me-2" alt="ResQPet Logo" />
                    <div className="brand-text">
                        <span className="brand-name">ResQPet</span>
                        <small className="brand-tagline">Compassion in Action</small>
                    </div>
                </Link>

                <div className="d-flex align-items-center">
                    <button className="theme-toggle-btn me-2" onClick={toggleTheme}>
                        {theme === 'light' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}
                    </button>

                    <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        {!role && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/rescue">Report Animal</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/track">Track Status</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/register">Register NGO</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="btn-primary btn-sm text-decoration-none" to="/login">Login</Link>
                                </li>
                            </>
                        )}

                        {role === "ngo" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/ngo">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/managereq">Requests</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link-premium dropdown-toggle" href="#" id="ngoDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end glass border-0 shadow" aria-labelledby="ngoDropdown">
                                        <li><Link className="dropdown-item" to="/epngo">Edit Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/cpngo">Change Password</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link className="dropdown-item text-danger" to="/logout">Logout</Link></li>
                                    </ul>
                                </li>
                            </>
                        )}

                        {role === "admin" && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/admin">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/managengo">Manage NGOs</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link-premium" to="/managereq">Rescue Requests</Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link-premium dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end glass border-0 shadow" aria-labelledby="adminDropdown">
                                        <li><Link className="dropdown-item" to="/epadmin">Edit Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/cpadmin">Change Password</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link className="dropdown-item text-danger" to="/logout">Logout</Link></li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
