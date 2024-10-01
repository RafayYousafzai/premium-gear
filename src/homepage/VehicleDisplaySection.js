import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './styles/VehicleDisplaySection.css';
import { useNavigate } from 'react-router-dom';

const VehicleDisplaySection = () => {
    const [vehicles, setVehicles] = useState([]);
    const vehicleCardsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            const vehiclesCollection = collection(db, 'vehicles');
            const vehiclesSnapshot = await getDocs(vehiclesCollection);
            const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVehicles(vehiclesList);
        };

        fetchVehicles();
    }, []);

    const handleScroll = (direction) => {
        if (vehicleCardsRef.current) {
            const { scrollLeft, clientWidth } = vehicleCardsRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            
            vehicleCardsRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    const handleViewVehicle = (id) => {
        navigate(`/vehicle/${id}`);
    };

    return (
        <section className="vehicle-display-section">
            <h2>Stock de vehiculos</h2>
            <div className="vehicle-cards-container">
                <div className="nav-arrow prev-arrow" onClick={() => handleScroll('left')}>‹</div>
                <div className="vehicle-cards" ref={vehicleCardsRef}>
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="vehicle-card">
                            <div className={`vehicle-status ${vehicle.status.toLowerCase()}`}>
                                {vehicle.status}
                            </div>
                            <div className="image-container">
                                <img src={vehicle.mainImage} alt={vehicle.name} className="vehicle-image" />
                            </div>
                            <div className="vehicle-info">
                                <div className="left-section">
                                    <h3 className="vehicle-name">{vehicle.brand} {vehicle.name}</h3>
                                    <p className="vehicle-details">{vehicle.mileage} km</p>
                                    <p className="vehicle-details">{vehicle.bodyStyle} - {vehicle.powerOutput} HP</p>
                                    <p className="vehicle-details">{vehicle.year} - {vehicle.transmission}</p>
                                </div>
                                <div className="right-section">
                                    <p className="vehicle-price">€{vehicle.price}</p>
                                    <p className="vehicle-reservation-small">Reserva: €{vehicle.reservationPrice}</p>
                                </div>
                            </div>
                            <button className="view-vehicle-button" onClick={() => handleViewVehicle(vehicle.id)}>
                                Ver este coche
                            </button>
                        </div>
                    ))}
                </div>
                <div className="nav-arrow next-arrow" onClick={() => handleScroll('right')}>›</div>
            </div>
        </section>
    );
};

export default VehicleDisplaySection;
