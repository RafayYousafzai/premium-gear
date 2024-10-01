import React, { useState } from "react";
import "./styles/ReservationConfirmationPopup.css";

const ReservationConfirmationPopup = ({ vehicle, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmClick = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Confirm Reservation</h2>
        <p>Are you sure you want to confirm your reservation for:</p>
        <h3>
          {vehicle.brand} {vehicle.name}
        </h3>
        <p className="reservation-price">
          Reservation Price: €{vehicle.reservationPrice}
        </p>
        <p className="notification-text">
          An email will be sent to you with the booking details along with the
          bank details to make the due amount, which is the reservation price.
          Please make sure all the information is correct.
        </p>
        {loading ? (
          <div className="preloader">Processing your reservation...</div>
        ) : (
          <>
            <button className="confirm-button" onClick={handleConfirmClick}>
              Yes, Confirm
            </button>
            <button className="cancel-button" onClick={onCancel}>
              No, Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationConfirmationPopup;
