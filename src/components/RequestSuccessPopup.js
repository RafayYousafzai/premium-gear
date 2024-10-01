import React from 'react';
import './styles/RequestSuccessPopup.css';

const RequestSuccessPopup = ({ onClose, personalInfo, vehicleInfo }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Solicitud Enviada</h2>
                <div className="popup-content">
                    <div className="info-section">
                        <h3>Información Personal</h3>
                        <p><strong>Nombre:</strong> {personalInfo.name}</p>
                        <p><strong>Ciudad:</strong> {personalInfo.city}</p>
                        <p><strong>Número de Teléfono:</strong> {personalInfo.phone}</p>
                        <p><strong>Correo Electrónico:</strong> {personalInfo.email}</p>
                    </div>
                    <div className="info-section">
                        <h3>Información del Vehículo</h3>
                        <p><strong>Nombre del Vehículo:</strong> {vehicleInfo.name}</p>
                        <p><strong>Año:</strong> {vehicleInfo.year}</p>
                        <p><strong>Presupuesto:</strong> {vehicleInfo.budget}</p>
                        <p><strong>Descripción Detallada:</strong> {vehicleInfo.description}</p>
                    </div>
                </div>
                <div className="success-message">
                    <p>¡Solicitud enviada con éxito! Nuestro equipo se pondrá en contacto contigo pronto.</p>
                </div>
            </div>
        </div>
    );
}

export default RequestSuccessPopup;
