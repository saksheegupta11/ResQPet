import './Footer.css';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    return (
        <footer className="footer-premium">
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <div className="footer-brand mb-4">
                            <img src="./assests/images/logo.png" className="logo-footer mb-3" alt="ResQPet Logo" />
                            <h4 className="text-primary">ResQPet Organization</h4>
                            <p className="footer-desc">
                                Dedicated to rescuing and rehabilitating stray animals. 
                                We bridge the gap between reporting an injury and providing professional care.
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-4">
                        <h5 className="footer-title">Quick Links</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/rescue">Report Animal</Link></li>
                            <li><Link to="/register">Register NGO</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-4">
                        <h5 className="footer-title">Contact Us</h5>
                        <ul className="contact-list">
                            <li><Phone size={18} className="me-2 text-primary" /> 120-240-9600</li>
                            <li><Mail size={18} className="me-2 text-primary" /> ResQPet@gmail.com</li>
                            <li><MapPin size={18} className="me-2 text-primary" /> ResQPet Centre, Indore</li>
                        </ul>
                        <Link to="/managengo" className="btn-primary btn-sm mt-3 d-inline-block text-decoration-none">
                            Find Nearest NGO
                        </Link>
                    </div>

                    <div className="col-lg-3 col-md-4">
                        <h5 className="footer-title">Follow Us</h5>
                        <p className="footer-desc">Stay updated with our latest rescue stories.</p>
                        <div className="footer-socials d-flex gap-3 mt-3">
                            <a href="#" className="social-icon-box"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="social-icon-box"><i className="bi bi-youtube"></i></a>
                        </div>
                    </div>
                </div>

                <hr className="footer-divider mt-5 mb-4" />
                
                <div className="row">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="copyright">&copy; 2025 ResQPet Org. All Rights Reserved.</p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div className="footer-legal">
                            <span>Privacy Policy</span>
                            <span className="ms-3">Terms of Use</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
