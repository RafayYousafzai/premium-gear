import React from 'react';
import './styles/TwoColumnSection.css';
import { FaCarAlt, FaShieldAlt, FaUndoAlt } from 'react-icons/fa'; // Updated to include the icons

const TwoColumnSection = () => {
    return (
        <section className="two-column-section">
            <div className="column">
                <FaCarAlt className="icon" />
                <h3>Excelente selección</h3>
                <p>Buscamos por toda Europa para traer el el coche que mejor se adapta a ti.</p>
            </div>
            <div className="column">
                <FaShieldAlt className="icon" />
                <h3>Calidad asegurada</h3>
                <p>Todos los coches son minuciosamente revisados y entregados con garantia includa. Asi te evitamos sorpresas indeseadas!</p>
            </div>
            <div className="column">
                <FaUndoAlt className="icon" />
                <h3>Satisfacción garantizada</h3>
                <p>Disfruta de una garantia extra de devolucion de 15 dias 0 500km.</p>
                <p>* Terminos y condiciones</p>
            </div>
        </section>
    );
}

export default TwoColumnSection;
