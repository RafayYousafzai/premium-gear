import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/ReservationSuccessPage.css";

const ReservationSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber || "N/A";
  const invoiceUrl = location.state?.invoiceUrl || "";

  if (!location.state) {
    // Redirect to the homepage or another appropriate page if there's no state
    navigate("/");
    return null;
  }

  return (
    <div className="reservation-success-page">
      <Header />
      <div className="content-container">
        <h1>Reservation Confirmed!</h1>
        <p>
          Your reservation has been successfully created with the order number{" "}
          <strong>{orderNumber}</strong>.
        </p>
        <p>An email has been sent to you with all the booking details.</p>
        {invoiceUrl && (
          <a href={invoiceUrl} download className="download-button">
            Download Invoice
          </a>
        )}
        <button
          className="user-dashboard-button"
          onClick={() => (window.location.href = "/user")}
        >
          Go to User Dashboard
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ReservationSuccessPage;
