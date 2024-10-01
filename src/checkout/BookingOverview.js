import React from "react";
import "./styles/BookingOverview.css";

const BookingOverview = ({
  name,
  phone,
  dob,
  dni,
  street,
  zipCode,
  city,
  country,
}) => {
  return (
    <div className="booking-overview-section">
      <h2>Booking Overview</h2>

      <div>
        <p className="section-title">Personal Information</p>
        <div className="form-row">
          <div className="form-group">
            <p className="info-item">
              Name: <span>{name}</span>
            </p>
          </div>
          <div className="form-group">
            <p className="info-item">
              Phone: <span>{phone}</span>
            </p>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <p className="info-item">
              Date of Birth: <span>{dob}</span>
            </p>
          </div>
          <div className="form-group">
            <p className="info-item">
              DNI or NIE Number: <span>{dni}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="section-title">Billing Address</p>
        <div className="form-group full-width">
          <p className="info-item">
            Street: <span>{street}</span>
          </p>
        </div>
        <div className="form-row">
          <div className="form-group">
            <p className="info-item">
              Zip Code: <span>{zipCode}</span>
            </p>
          </div>
          <div className="form-group">
            <p className="info-item">
              City: <span>{city}</span>
            </p>
          </div>
        </div>
        <div className="form-group full-width">
          <p className="info-item">
            Country: <span>{country}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingOverview;
