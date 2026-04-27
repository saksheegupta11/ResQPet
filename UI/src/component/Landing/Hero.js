import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-modern">
      <div className="hero-content container">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge-nature">RESQPET PROTECTOR</span>
          <h1>Every Life <span className="text-gradient">Matters</span>, No Matter How Small.</h1>
          <p>
            Help injured animals get the emergency care they deserve. We connect animal lovers 
            with dedicated NGOs in real-time. Rescue in one click.
          </p>
          <div className="hero-btns">
            <Link to="/rescue" className="btn-primary-lg">
              Report Now <Zap className="ms-2" size={20} />
            </Link>
            <Link to="/register" className="btn-primary-lg ms-3">
              NGO Join <Shield className="ms-2" size={20} />
            </Link>
          </div>
          
          <div className="hero-trust">
            <div className="trust-item">
              <span className="count">2K+</span>
              <span className="label">Rescues</span>
            </div>
            <div className="divider"></div>
            <div className="trust-item">
              <span className="count">50+</span>
              <span className="label">NGO Partners</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="image-stack">
            <img src="/assests/images/banner3.jpg" className="main-img" alt="Dog Rescue" />
            <div className="floating-card glass">
              <Heart className="text-danger me-2" fill="currentColor" />
              <span>100% Volunteer Driven</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
