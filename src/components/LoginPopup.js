import React, { useState } from 'react';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './styles/LoginPopup.css';

const LoginPopup = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate(); // Use navigate hook

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
            onClose(); // Close the popup on successful login
            navigate('/dashboard'); // Redirect to the dashboard after login
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
            onClose(); // Close the popup on successful signup
            navigate('/dashboard'); // Redirect to the dashboard after signup
        } catch (error) {
            setError("Error signing up. Please try again.");
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{step === 2 ? "Login" : step === 3 ? "Register" : "Login or Register"}</h2>
                <p>Please enter your email to login or register.</p>

                {step === 1 && (
                    <>
                        <label>Email</label>
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
        </div>
    );
};

export default LoginPopup;
