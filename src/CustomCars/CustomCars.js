import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RequestSuccessMessage from '../components/RequestSuccessMessage';
import Preloader from '../components/Preloader'; // Import the Preloader component
import './styles/CustomCars.css'; 
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'; // Import addDoc for saving data to Firestore
import { sendRequestFormEmail } from '../utils/emailSenderRequestForm'; 

const CustomCars = () => {
    const [vehicleOptions, setVehicleOptions] = useState([
        { brand: '', model: '', fuel: '', yearFrom: '', yearTo: '', powerFrom: '', powerTo: '' }
    ]);
    const [knownCarBrands] = useState([
        "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
        "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dodge", "Ferrari",
        "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar",
        "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Maserati",
        "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Pagani",
        "Peugeot", "Porsche", "Ram", "Renault", "Rolls-Royce", "Saab", "Subaru",
        "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
    ]);
    const [years] = useState([
        2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
        2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
        2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990
    ]);
    const [powerOptions] = useState([
        "50 cv (37 kW)", "60 cv (44 kW)", "70 cv (51 kW)", "80 cv (59 kW)", 
        "90 cv (66 kW)", "100 cv (74 kW)", "110 cv (81 kW)", "120 cv (88 kW)",
        "130 cv (96 kW)", "140 cv (103 kW)", "150 cv (110 kW)", "160 cv (118 kW)",
        "170 cv (125 kW)", "180 cv (132 kW)", "190 cv (140 kW)", "200 cv (147 kW)",
        "250 cv (184 kW)", "300 cv (221 kW)", "350 cv (258 kW)", "400 cv (294 kW)",
        "500 cv (368 kW)"
    ]);
    const [fuels] = useState([
        "Diésel", "Gasolina", "Eléctrico", "Híbrido", "Híbrido enchufable",
        "Gas licuado (GLP)", "Gas natural (CNG)", "Otros"
    ]);
    const [budgets] = useState([
        "1.000 €", "2.000 €", "3.000 €", "4.000 €", "5.000 €", "6.000 €", 
        "7.000 €", "8.000 €", "9.000 €", "10.000 €", "11.000 €", "12.000 €", 
        "13.000 €", "14.000 €", "15.000 €", "16.000 €", "17.000 €", "18.000 €", 
        "19.000 €", "20.000 €", "21.000 €", "22.000 €", "23.000 €", "24.000 €", 
        "25.000 €", "30.000 €", "35.000 €", "40.000 €", "50.000 €", "60.000 €", 
        "70.000 €"
    ]);
    const [budget, setBudget] = useState(""); 

    const handleVehicleChange = (index, field, value) => {
        const updatedOptions = [...vehicleOptions];
        updatedOptions[index][field] = value;
        setVehicleOptions(updatedOptions);
    };

    const addVehicleOption = () => {
        if (vehicleOptions.length < 4) {
            setVehicleOptions([
                ...vehicleOptions,
                { brand: '', model: '', fuel: '', yearFrom: '', yearTo: '', powerFrom: '', powerTo: '' }
            ]);
        }
    };

    const removeVehicleOption = (index) => {
        const updatedOptions = vehicleOptions.filter((_, i) => i !== index);
        setVehicleOptions(updatedOptions);
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setFirstName(userData.firstName || '');
                        setLastName(userData.lastName || '');
                        setFullAddress(userData.address || '');
                        setCity(userData.city || '');
                        setPhoneNumber(userData.phone || '');
                        setEmail(userData.email || '');
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show preloader
        
        // Convert vehicle options to an array of objects
        const vehicleOptionsArray = vehicleOptions.map((option, index) => ({
            brand: option.brand || 'No especificado',
            model: option.model || 'No especificado',
            fuel: option.fuel || 'No especificado',
            yearFrom: option.yearFrom || 'No especificado',
            yearTo: option.yearTo || 'No especificado',
            powerFrom: option.powerFrom || 'No especificado',
            powerTo: option.powerTo || 'No especificado',
        }));
    
        const templateParams = {
            first_name: firstName,
            last_name: lastName,
            full_address: fullAddress,
            city,
            phone_number: phoneNumber,
            sender_email: email,
            vehicle_options: vehicleOptionsArray // Pass as an array of objects
        };
    
        try {
            // Save request data to the 'customcars' collection in Firestore
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(db, 'customcars'), {
                    userId: user.uid,
                    ...templateParams,
                    createdAt: new Date(),
                });
            }

            // Send email using SMTP
            await sendRequestFormEmail(templateParams);
            setShowPopup(true);
        } catch (error) {
            console.error('Error saving user data or sending email:', error);
            alert('There was a problem sending your request. Please try again.');
        } finally {
            setLoading(false); // Hide preloader after processing
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setVehicleOptions([
            { brand: '', model: '', fuel: '', yearFrom: '', yearTo: '', powerFrom: '', powerTo: '' }
        ]);
    };

    return (
        <div className="custom-cars-page">
            <Header />
            <div className="custom-content">
                <h1>DINOS QUE BUSCAS Y NOSOTROS LO ENCONTRAMOS</h1>
                <h2>Información de contacto (Autorellenable si ha iniciado sesión)</h2>
                <form onSubmit={handleSubmit} className="custom-form">
                    <h3>Información Personal</h3>
                    <div className="custom-form-group custom-row">
                        <div className="custom-column">
                            <label htmlFor="firstName">Nombre:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="custom-column">
                            <label htmlFor="lastName">Apellido:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="custom-form-group custom-row">
                        <div className="custom-column">
                            <label htmlFor="phoneNumber">Número de Teléfono:</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="custom-column">
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="custom-form-group custom-row">
                        <div className="custom-column">
                            <label htmlFor="fullAddress">Dirección Completa:</label>
                            <input
                                type="text"
                                id="fullAddress"
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="custom-column">
                            <label htmlFor="city">Ciudad:</label>
                            <input
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="vehicle-info-section">
                        <h3>Información del Vehículo</h3>
                        <p>(Rellene sólo los campos que tenga claros, si los deja en blanco entenderemos que está abierto a recomendaciones y le podremos ofrecer más opciones).</p>
                        {vehicleOptions.map((option, index) => (
                            <div key={index} className="vehicle-option-group">
                                <h4>Opción {index + 1}</h4>
                                <div className="custom-form-group custom-row">
                                    <div className="custom-column">
                                        <label htmlFor={`brand-${index}`}>Marca:</label>
                                        <select
                                            id={`brand-${index}`}
                                            value={option.brand}
                                            onChange={(e) => handleVehicleChange(index, 'brand', e.target.value)}
                                        >
                                            <option value="">Seleccione una Marca</option>
                                            {knownCarBrands.map((brand) => (
                                                <option key={brand} value={brand}>
                                                    {brand}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="custom-column">
                                        <label htmlFor={`model-${index}`}>Modelo:</label>
                                        <input
                                            type="text"
                                            id={`model-${index}`}
                                            value={option.model}
                                            onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="custom-form-group custom-row">
                                    <div className="custom-column">
                                        <label htmlFor={`yearFrom-${index}`}>Año desde:</label>
                                        <select
                                            id={`yearFrom-${index}`}
                                            value={option.yearFrom}
                                            onChange={(e) => handleVehicleChange(index, 'yearFrom', e.target.value)}
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="custom-column">
                                        <label htmlFor={`yearTo-${index}`}>Año hasta:</label>
                                        <select
                                            id={`yearTo-${index}`}
                                            value={option.yearTo}
                                            onChange={(e) => handleVehicleChange(index, 'yearTo', e.target.value)}
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="custom-form-group custom-row">
                                    <div className="custom-column">
                                        <label htmlFor={`powerFrom-${index}`}>Potencia desde:</label>
                                        <select
                                            id={`powerFrom-${index}`}
                                            value={option.powerFrom}
                                            onChange={(e) => handleVehicleChange(index, 'powerFrom', e.target.value)}
                                        >
                                            {powerOptions.map((power) => (
                                                <option key={power} value={power}>{power}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="custom-column">
                                        <label htmlFor={`powerTo-${index}`}>Potencia hasta:</label>
                                        <select
                                            id={`powerTo-${index}`}
                                            value={option.powerTo}
                                            onChange={(e) => handleVehicleChange(index, 'powerTo', e.target.value)}
                                        >
                                            {powerOptions.map((power) => (
                                                <option key={power} value={power}>{power}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="custom-form-group">
                                    <label htmlFor={`fuel-${index}`}>Combustible:</label>
                                    <select
                                        id={`fuel-${index}`}
                                        value={option.fuel}
                                        onChange={(e) => handleVehicleChange(index, 'fuel', e.target.value)}
                                    >
                                        {fuels.map((fuel) => (
                                            <option key={fuel} value={fuel}>{fuel}</option>
                                        ))}
                                    </select>
                                </div>
                                {vehicleOptions.length > 1 && (
                                    <button
                                        type="button"
                                        className="custom-remove-option-button"
                                        onClick={() => removeVehicleOption(index)}
                                    >
                                        Eliminar Opción
                                    </button>
                                )}
                            </div>
                        ))}
                        {vehicleOptions.length < 4 && (
                            <button type="button" className="custom-add-option-button" onClick={addVehicleOption}>
                                Añadir opción
                            </button>
                        )}
                    </div>
                    <div className="custom-form-group">
                        <label htmlFor="budget">Presupuesto máximo:</label>
                        <select
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        >
                            {budgets.map((budgetOption) => (
                                <option key={budgetOption} value={budgetOption}>{budgetOption}</option>
                            ))}
                        </select>
                    </div>
                    <div className="custom-form-group">
                        <label htmlFor="extras">Extras deseados:</label>
                        <input
                            type="text"
                            id="extras"
                            placeholder="Si los hubiese, separados por comas"
                        />
                    </div>
                    <div className="custom-form-group">
                        <label htmlFor="observations">Observaciones:</label>
                        <textarea
                            id="observations"
                            placeholder="Cualquier observación adicional"
                        ></textarea>
                    </div>
                    <div className="custom-checkbox-group">
                        <input type="checkbox" id="offer-similar" />
                        <label htmlFor="offer-similar">
                            Marque esta casilla si desea que, en caso de que no encontremos lo que busca, le ofrezcamos modelos similares en especificaciones y características adaptados a su presupuesto.
                        </label>
                    </div>

                    <button type="submit" className="custom-submit-button">Enviar Solicitud</button>
                    <p className="custom-note">
                        Tenga en cuenta que en caso de que el computo de los filtros que haya usted indicado no genere opciones viables, no podremos ofrecerle opciones. El modelo que busca debe estar siempre adaptado a su presupuesto.
                    </p>
                </form>
            </div>
            <Footer />
            {loading && <Preloader />} {/* Show Preloader when loading */}
            {showPopup && (
                <RequestSuccessMessage
                    onClose={closePopup}
                    email={email}
                />
            )}
        </div>
    );
}

export default CustomCars;
