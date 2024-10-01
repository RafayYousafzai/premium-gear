import React from 'react';
import './styles/TextButtonSection.css';

const TextButtonSection = () => {
    return (
        <section className="text-button-section">
            <h1>El mayor concesionario independiente de Europa</h1>
            <p>3.000+ coches al mejor precio | Inspeccionados y reacondicionados | Garantía gratuita de 12 meses incluida</p>
            <div className="button-container">
                <button className="cta-button orange">Encarga tu coche</button>
                <button className="cta-button blue">Opotunidades en Stock</button>
            </div>
        </section>
    );
}

export default TextButtonSection;
