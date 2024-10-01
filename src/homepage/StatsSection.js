import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Import WhatsApp icon
import './styles/StatsSection.css';

const StatsSection = () => {
    return (
        <section className="stats-section">
            <div className="stats-content">
                <h2>¿Tienes dudas?</h2>
                <p className="sub-heading">¿No te decides por un modelo?</p>
                <p className="sub-heading">Consúltanos sin compromiso</p>
            </div>
            <a href="https://wa.me/1234567890" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} className="whatsapp-icon" />
            </a>
        </section>
    );
}

export default StatsSection;
