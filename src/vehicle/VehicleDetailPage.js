import React from 'react';
import './styles/VehicleDetailPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaCalculator, FaTruck, FaShieldAlt } from 'react-icons/fa';
import CarDetailsSection from './CarDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedOption, setSelectedOption] = useState('buy');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            const docRef = doc(db, 'vehicles', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setVehicle(docSnap.data());
            }
        };

        fetchVehicle();
    }, [id]);

    const handleNextImage = () => {
        setCurrentImage((prevIndex) =>
            prevIndex === vehicle.galleryImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImage((prevIndex) =>
            prevIndex === 0 ? vehicle.galleryImages.length - 1 : prevIndex - 1
        );
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handlePurchaseClick = () => {
        if (selectedOption === 'buy') {
            navigate(`/checkout/${id}`);
        }
    };

    if (!vehicle) return <div>Loading...</div>;

    return (
        <div className="vehicle-detail-page">
            <Header />
            <div className="vehicle-detail-main">
                <div className="left-section">
                    <div className="vehicle-gallery-section">
                        <div className="gallery-container">
                            <div className="main-image-container">
                                <img
                                    src={vehicle.galleryImages[currentImage]}
                                    alt={vehicle.name}
                                    className="main-image"
                                />
                                <button className="prev-arrow" onClick={handlePrevImage}>‹</button>
                                <button className="next-arrow" onClick={handleNextImage}>›</button>
                            </div>
                            <div className="thumbnail-container">
                                {vehicle.galleryImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${vehicle.name} ${index + 1}`}
                                        className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <CarDetailsSection />
                    <AdditionalInfoSection />
                </div>

                <div className="right-section">
                    <div className="sticky-section">
                        <div className="vehicle-header">
                            <h1 className="vehicle-title">{vehicle.brand} {vehicle.name}</h1>
                        </div>
                        <div className="price-section">
                            <div>
                                <h3 className="price-heading">Precio</h3>
                                <p className="vehicle-price">€{vehicle.price}</p>
                            </div>
                            <span className="vertical-line"></span>
                            <div>
                                <h3 className="reservation-heading">Reserva</h3>
                                <p className="vehicle-reservation">€{vehicle.reservationPrice}</p>
                            </div>
                        </div>
                        <p className="vehicle-location">
                            <FaMapMarkerAlt style={{ marginRight: '5px', color: '#87572b' }} />
                            {vehicle.location}
                        </p>

                        <div className="options-container">
                            <div 
                                className={`option-box ${selectedOption === 'buy' ? 'active' : ''}`} 
                                onClick={() => handleOptionChange('buy')}
                            >
                                <span className="radio-icon"></span>
                                <h4 className="option-box-title">Cómpralo ahora</h4>
                                <p className="option-box-description">Entrega a domicilio o Recogida</p>
                            </div>
                            <div 
                                className={`option-box ${selectedOption === 'contact' ? 'active' : ''}`} 
                                onClick={() => handleOptionChange('contact')}
                            >
                                <span className="radio-icon"></span>
                                <h4 className="option-box-title">Contáctanos</h4>
                                <p className="option-box-description">Llámanos o envíanos un mensaje</p>
                            </div>
                        </div>

                        <button className="action-button" onClick={handlePurchaseClick}>
                            {selectedOption === 'buy' ? 'Cómpralo ahora' : 'Contáctanos'}
                        </button>

                        <div className="info-section">
                            <div className="info-item">
                                <FaCalculator />
                                <span className="info-text">Planes de financiación desde € al mes (sin entrada)</span>
                            </div>
                            <div className="info-item">
                                <FaTruck />
                                <span className="info-text">Para ver las fechas de entrega más rápidas</span>
                            </div>
                            <div className="info-item">
                                <FaShieldAlt />
                                <span className="info-text">1 año de garantía gratuita</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VehicleDetailPage;
