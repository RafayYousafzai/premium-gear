import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './styles/BookingDetails.css';

const BookingDetails = ({ onContinue, userData }) => {
    const [name, setName] = useState(userData.name || '');
    const [phone, setPhone] = useState(userData.phone || '');
    const [dob, setDob] = useState(userData.dob || '');
    const [dni, setDni] = useState(userData.dni || '');
    const [street, setStreet] = useState(userData.street || '');
    const [zipCode, setZipCode] = useState(userData.zipCode || '');
    const [city, setCity] = useState(userData.city || '');
    const [country, setCountry] = useState(userData.country || 'Spain');

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setName(userData.name || '');
                    setPhone(userData.phone || '');
                    setDob(userData.dob || '');
                    setDni(userData.dni || '');
                    setStreet(userData.street || '');
                    setZipCode(userData.zipCode || '');
                    setCity(userData.city || '');
                    setCountry(userData.country || 'Spain');
                }
            }
        };

        fetchUserData();
    }, []);

    const handleContinue = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, {
                    name,
                    phone,
                    dob,
                    dni,
                    street,
                    zipCode,
                    city,
                    country
                });
                onContinue({ name, phone, dob, dni, street, zipCode, city, country });
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    return (
        <div className="booking-details-section">
            <h2>Personal Information</h2>
            <div className="form-row">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="text"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="DD/MM/YYYY"
                    />
                </div>
                <div className="form-group">
                    <label>DNI or NIE Number</label>
                    <input
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                    />
                </div>
            </div>

            <h2>Billing Address</h2>
            <p>Enter your billing address to send you all the documentation for your car</p>
            <div className="form-group">
                <label>Street</label>
                <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Zip Code</label>
                    <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Country</label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>

            <button onClick={handleContinue}>Continue</button>
        </div>
    );
};

export default BookingDetails;
