import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingDetails from './BookingDetails';
import BookingOverview from './BookingOverview';
import ReservationConfirmationPopup from './ReservationConfirmationPopup';
import { generateInvoicePdf } from '../utils/invoiceGenerator';
import { sendEmail } from '../utils/emailSender';
import './styles/CheckoutPage.css';

const CheckoutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showOverview, setShowOverview] = useState(false);
    const [userData, setUserData] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            const docRef = doc(db, 'vehicles', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setVehicle(docSnap.data());
            } else {
                console.error('Vehicle not found');
            }
        };

        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                setIsAuthenticated(true);
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUserData({
                        name: userData.name || '',
                        phone: userData.phone || '',
                        dob: userData.dob || '',
                        dni: userData.dni || '',
                        street: userData.street || '',
                        zipCode: userData.zipCode || '',
                        city: userData.city || '',
                        country: userData.country || 'Spain',
                        email: userData.email || user.email,
                    });
                }
            }
        };

        fetchVehicleDetails();
        fetchUserData();
    }, [id]);

    const handleEmailCheck = async () => {
        setError(null);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setIsRegistered(true);
                setStep(2);
            } else {
                setIsRegistered(false);
                setStep(3);
            }
        } catch (error) {
            setError("An error occurred while checking the email. Please try again.");
            console.error("Error checking email:", error);
        }
    };

    const handleLogin = async () => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
        } catch (error) {
            setError("Incorrect login credentials. Please try again.");
            console.error("Error logging in:", error);
        }
    };

    const handleSignUp = async () => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                name,
                phone,
                role: "user"
            });

            setIsAuthenticated(true);
        } catch (error) {
            setError("Error signing up. Please try again.");
            console.error("Error signing up:", error);
        }
    };

    const handleContinue = (data) => {
        setUserData(data);
        setShowOverview(true);
    };

    const handleConfirmReservation = () => {
        setShowPopup(true);
    };

    const handleCancelReservation = () => {
        setShowPopup(false);
    };

    const handleCompleteReservation = async () => {
        try {
            const user = auth.currentUser;
            const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
            // Ensure all user data fields are present and correctly populated
            const completeUserData = {
                ...userData,
                email: user.email || userData.email,  // Ensure email is passed correctly
                address: `${userData.street}, ${userData.city}, ${userData.zipCode}, ${userData.country}`
            };

            // Save reservation to Firebase
            const reservationDocRef = doc(db, 'Reservations', orderNumber);
            await setDoc(reservationDocRef, {
                userId: user.uid,
                vehicleId: vehicle.id,
                ...completeUserData,
                orderNumber,
                status: 'Reserved',
                createdAt: new Date(),
            });

            // Update vehicle status to Reserved
            const vehicleDocRef = doc(db, 'vehicles', vehicle.id);
            await updateDoc(vehicleDocRef, {
                status: 'Reserved',
            });

            // Generate PDF Invoice
            const invoiceUrl = await generateInvoicePdf({
                vehicle,
                userData: completeUserData,  // Pass the complete user data here
                orderNumber,
                totalPrice: vehicle.price,
                reservationPrice: vehicle.reservationPrice,
            });

            console.log('Invoice URL to be sent:', invoiceUrl); // Log the invoice URL

            // Send an email with booking details and the invoice using EmailJS
            await sendEmail({
                to: user.email,  // User's email address
                subject: `Reservation Confirmation - ${vehicle.brand} ${vehicle.name}`,
                html: `<p>Dear ${completeUserData.name},</p>
                       <p>Your reservation for <strong>${vehicle.brand} ${vehicle.name}</strong> has been confirmed.</p>
                       <p>Total Price: €${vehicle.price}</p>
                       <p>Reservation Price: €${vehicle.reservationPrice}</p>
                       <p>Please find the attached invoice.</p>`,
                sender: 'Premium Gear <support@leigonhost.com>',  // Sender's name and email (optional)
                attachment: invoiceUrl,  // The URL to the PDF invoice
                vehicle: vehicle,
                userData: completeUserData,
                orderNumber: orderNumber,
            });

            // Redirect to the Reservation Success page with the order number
            setShowPopup(false);
            navigate('/reservation-success', { state: { orderNumber, invoiceUrl } });

        } catch (error) {
            console.error("Error confirming reservation:", error);
            setShowPopup(false);
        }
    };

    if (!vehicle) return <div>Loading...</div>;

    return (
        <div className="checkout-page">
            <Header />
            <div className="checkout-container">
                <div className="auth-section">
                    {isAuthenticated ? (
                        showOverview ? (
                            <BookingOverview {...userData} />
                        ) : (
                            <BookingDetails onContinue={handleContinue} userData={userData} />
                        )
                    ) : (
                        <div>
                            <div className="auth-header">
                                <h2>{step === 2 ? "Login" : step === 3 ? "Register" : "Login or register"}</h2>
                                <p>Please enter your email and log in to your account. From your account you can place your order, manage your purchase and follow all the updates in a safe and transparent way.</p>
                            </div>

                            {step === 1 && (
                                <>
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@example.com"
                                        required
                                    />
                                    <button onClick={handleEmailCheck}>Continue</button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                    <button onClick={handleLogin}>Login</button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        required
                                    />
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        required
                                    />
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                    <button onClick={handleSignUp}>Sign Up</button>
                                </>
                            )}

                            {error && <p className="error">{error}</p>}
                        </div>
                    )}
                </div>
                <div className="vehicle-summary">
                    <div className="image-container">
                        <img src={vehicle.mainImage} alt={vehicle.name} />
                    </div>
                    <h3>{vehicle.brand} {vehicle.name}</h3>
                    <p>{vehicle.year} · {vehicle.mileage} km</p>
                    <hr />
                    <p className="total-price"><strong>Total Price:</strong> €{vehicle.price}</p>
                    <p className="reservation-price"><strong>Reservation Price:</strong> €{vehicle.reservationPrice}</p>
                    {showOverview && (
                        <button className="confirm-button" onClick={handleConfirmReservation}>Confirm Reservation</button>
                    )}
                </div>
            </div>
            <Footer />
            {showPopup && (
                <ReservationConfirmationPopup 
                    vehicle={vehicle} 
                    onConfirm={handleCompleteReservation}
                    onCancel={handleCancelReservation}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
