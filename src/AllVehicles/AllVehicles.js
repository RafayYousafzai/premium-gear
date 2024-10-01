import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/AllVehicles.css';
import { useNavigate } from 'react-router-dom';

const AllVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        year: '',
        km: '',
        bodyType: '',
        color: '',
        price: '',
    });
    const [sortOrder, setSortOrder] = useState('A-Z');
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
            setFilteredVehicles(vehiclesList);
        };

        fetchVehicles();
    }, []);

    useEffect(() => {
        filterAndSortVehicles();
    }, [filters, sortOrder]);

    const filterAndSortVehicles = () => {
        let filtered = vehicles.filter(vehicle => {
            return (
                (filters.brand === '' || vehicle.brand === filters.brand) &&
                (filters.year === '' || vehicle.year === parseInt(filters.year)) &&
                (filters.km === '' || vehicle.mileage === parseInt(filters.km)) &&
                (filters.bodyType === '' || vehicle.bodyStyle === filters.bodyType) &&
                (filters.color === '' || vehicle.color === filters.color) &&
                (filters.price === '' || vehicle.price === parseInt(filters.price))
            );
        });

        if (sortOrder === 'A-Z') {
            filtered = filtered.sort((a, b) => a.brand.localeCompare(b.brand));
        } else if (sortOrder === 'Precio') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'Precio de Reserva') {
            filtered = filtered.sort((a, b) => a.reservationPrice - b.reservationPrice);
        }

        setFilteredVehicles(filtered);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleViewVehicle = (id) => {
        navigate(`/vehicle/${id}`);
    };

    return (
        <div className="all-vehicles-page-custom">
            <Header />
            <div className="vehicles-content-custom">
                <h2>Stock de vehículos</h2>
                <div className="filters-row-custom">
                    <select name="brand" onChange={handleFilterChange}>
                        <option value="">Marca</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.brand))].map((brand, index) => (
                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <select name="km" onChange={handleFilterChange}>
                        <option value="">Km</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.mileage))].sort((a, b) => a - b).map((km, index) => (
                            <option key={index} value={km}>{km} km</option>
                        ))}
                    </select>
                    <select name="bodyType" onChange={handleFilterChange}>
                        <option value="">Tipo de carrocería</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.bodyStyle))].map((bodyType, index) => (
                            <option key={index} value={bodyType}>{bodyType}</option>
                        ))}
                    </select>
                    <select name="color" onChange={handleFilterChange}>
                        <option value="">Color</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.color))].map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                    <select name="year" onChange={handleFilterChange}>
                        <option value="">Año</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.year))].sort((a, b) => a - b).map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                    <select name="price" onChange={handleFilterChange}>
                        <option value="">Precio</option>
                        {[...new Set(vehicles.map(vehicle => vehicle.price))].sort((a, b) => a - b).map((price, index) => (
                            <option key={index} value={price}>€{price}</option>
                        ))}
                    </select>
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="A-Z">Ordenar por: A-Z</option>
                        <option value="Precio">Ordenar por: Precio</option>
                        <option value="Precio de Reserva">Ordenar por: Precio de Reserva</option>
                    </select>
                </div>
                <div className="vehicle-cards-custom">
                    {filteredVehicles.map(vehicle => (
                        <div key={vehicle.id} className="vehicle-card-custom">
                            <div className={`vehicle-status-custom ${vehicle.status.toLowerCase()}`}>
                                {vehicle.status}
                            </div>
                            <div className="image-container">
                                <img src={vehicle.mainImage} alt={vehicle.name} className="vehicle-image-custom" />
                            </div>
                            <div className="vehicle-info-custom">
                                <div className="left-section">
                                    <h3 className="vehicle-name-custom">{vehicle.brand} {vehicle.name}</h3>
                                    <p className="vehicle-details-custom">{vehicle.mileage} km</p>
                                    <p className="vehicle-details-custom">{vehicle.bodyStyle} - {vehicle.powerOutput} HP</p>
                                    <p className="vehicle-details-custom">{vehicle.year} - {vehicle.transmission}</p>
                                </div>
                                <div className="price-info-custom">
                                    <span className="total-price-custom">Precio Total: €{vehicle.price}</span>
                                    <span className="reservation-price-custom">Reserva: €{vehicle.reservationPrice}</span>
                                </div>
                            </div>
                            <button className="view-vehicle-button-custom" onClick={() => handleViewVehicle(vehicle.id)}>
                                Ver este coche
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AllVehicles;
