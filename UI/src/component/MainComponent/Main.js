import './Main.css';
import Hero from '../Landing/Hero';
import ImpactSection from '../Landing/ImpactSection';
import FeaturesSection from '../Landing/FeaturesSection';
import { motion } from 'framer-motion';

function Main() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="main-redesign"
        >
            <Hero />
            
            <section className="quote-section py-5 text-center glass m-4 rounded-4">
                <div className="container">
                    <h5 className="fst-italic text-muted">
                        "The greatness of a nation and its moral progress can be judged by the way its animals are treated."
                    </h5>
                    <small className="fw-bold mt-2 d-block">— Mahatma Gandhi</small>
                </div>
            </section>

            <ImpactSection />
            <FeaturesSection />

            <section className="cta-section section-padding text-center">
                <div className="container">
                    <motion.div 
                        className="premium-card glass p-5"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="mb-4 display-5 fw-bold">Ready to Make an Impact?</h2>
                        <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                            Join our network of rescuers and NGOs today. Together, we can ensure 
                            no stray animal suffers alone.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <a href="/register" className="btn-secondary-lg">Join as NGO</a>
                            <a href="/rescue" className="btn-secondary-lg">Report Case</a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
}

export default Main;