import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/Contacto.css';
import { sendContactFormEmail } from '../utils/emailSenderContacto';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RequestSuccessPopup from '../components/RequestSuccessPopup'; 

const Contact = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setName(userData.name || '');
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const templateParams = {
            name,
            phone_number: phoneNumber,
            message,
            sender_email: email,
        };

        sendContactFormEmail(templateParams)
            .then(() => {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000); // Automatically close the popup after 3 seconds
            })
            .catch(() => {
                alert('Hubo un problema al enviar el mensaje. Inténtalo de nuevo.');
            });
    };

    return (
        <div className="contact-page">
            <Header />
            <div className="contact-content">
                <form onSubmit={handleSubmit} className="contact-form">
                    <h2>Contacto</h2>
                    <div className="form-group">
                        <label htmlFor="name">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Número de Teléfono:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Mensaje:</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Enviar</button>
                </form>
            </div>
            {showPopup && (
                <RequestSuccessPopup
                    personalInfo={{ name, phone: phoneNumber, email }}
                    message={message}
                />
            )}
            <Footer />
        </div>
    );
};

export default Contact;
