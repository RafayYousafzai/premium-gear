import React from 'react';
import './styles/RequestSuccessMessage.css'; 

const RequestSuccessMessage = ({ onClose, email }) => {
    return (
        <div className="request-success-message-overlay">
            <div className="request-success-message-content">
                <span className="close-icon" onClick={onClose}>&times;</span>
                <h2>Solicitud Enviada con Éxito</h2>
                <p>Tu solicitud ha sido enviada con éxito.</p>
                <p>Se ha enviado una copia a tu correo electrónico registrado: <strong>{email}</strong></p>
            </div>
        </div>
    );
};

export default RequestSuccessMessage;
