import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Smile, PawPrint, Users, Award } from 'lucide-react';
import './ImpactSection.css';

const ImpactSection = () => {
    const stats = [
        { id: 1, icon: <Smile size={32} />, count: 2500, label: "Happy Returns", suffix: "+" },
        { id: 2, icon: <PawPrint size={32} />, count: 3200, label: "Animals Saved", suffix: "+" },
        { id: 3, icon: <Users size={32} />, count: 120, label: "Partner NGOs", suffix: "" },
        { id: 4, icon: <Award size={32} />, count: 15, label: "Cities Covered", suffix: "" }
    ];

    return (
        <section className="impact-section section-padding">
            <div className="container">
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <span className="section-subtitle">OUR IMPACT</span>
                        <h2 className="section-title">The Difference We Make Together</h2>
                    </div>
                </div>

                <div className="row g-4">
                    {stats.map((stat, index) => (
                        <div className="col-6 col-md-3" key={stat.id}>
                            <motion.div 
                                className="stat-card-premium"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="stat-icon-wrapper">
                                    {stat.icon}
                                </div>
                                <h3 className="stat-number">
                                    <CountUp end={stat.count} duration={3} enableScrollSpy />
                                    {stat.suffix}
                                </h3>
                                <p className="stat-label">{stat.label}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;
