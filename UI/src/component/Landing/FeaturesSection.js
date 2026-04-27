import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, MapPin, CheckCircle, HeartHandshake } from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
    const features = [
        {
            id: 1,
            title: "Report Quickly",
            description: "Submit a rescue request in seconds with a photo and location. No complicated forms.",
            icon: <PhoneCall size={32} />
        },
        {
            id: 2,
            title: "Smart Location",
            description: "Our system automatically identifies and maps your location for faster NGO dispatch.",
            icon: <MapPin size={32} />
        },
        {
            id: 3,
            title: "Verified NGOs",
            description: "Work with only verified, high-rated animal welfare organizations in your city.",
            icon: <CheckCircle size={32} />
        },
        {
            id: 4,
            title: "Real-time Alerts",
            description: "Stay updated as NGOs accept and respond to your rescue request.",
            icon: <HeartHandshake size={32} />
        }
    ];

    return (
        <section className="features-section section-padding">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-5">
                        <span className="section-subtitle">HOW IT WORKS</span>
                        <h2 className="section-title mb-4">Empowering Kindness Through Technology</h2>
                        <p className="lead text-muted mb-5">
                            ResQPet bridges the gap between stray animals in distress and the organizations 
                            dedicated to saving them.
                        </p>
                        <div className="feature-illustration glass p-4">
                            <img src="/assests/images/petgallery8.jpg" className="img-fluid rounded-4" alt="Rescue Process" />
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="row g-4">
                            {features.map((feature, index) => (
                                <div className="col-md-6" key={feature.id}>
                                    <motion.div 
                                        className="feature-card-premium"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="feature-icon">{feature.icon}</div>
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
