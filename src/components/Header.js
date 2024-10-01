import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './styles/Header.css';
import LoginPopup from './LoginPopup'; // Import the LoginPopup component

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [showLoginPopup, setShowLoginPopup] = useState(false); // State to control popup visibility

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                setIsLoggedIn(true);
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserName(userDocSnap.data().name);
                } else {
                    console.error('No such document!');
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        fetchUserName();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLoggedIn(false);
                setUserName('');
            })
            .catch((error) => {
                console.error('Logout error:', error.message);
                alert('Logout failed: ' + error.message);
            });
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/"> {/* Wrap the logo with Link to redirect to the homepage */}
                    <img src={process.env.PUBLIC_URL + '/assets/logo.png'} alt="Premium Gear Logo" className="logo" />
                </Link>
            </div>
            <nav className="main-nav">
                <ul>
                    <li><Link to="/custom-cars" className="highlight">Encargar Coches</Link></li>
                    <li><Link to="/cars-in-stock">Coches en Stock</Link></li> {/* Updated to link to AllVehicles page */}
                    <li><Link to="/about-us">Garantía Premium Gear</Link></li> {/* Updated to link to AboutUs page */}
                    <li><Link to="/contact">Contacto</Link></li> {/* Updated to link to Contacto page */}
                    <li><Link to="/shop">Tienda</Link></li>
                </ul>
            </nav>
            <div className="profile-container">
                {isLoggedIn ? (
                    <div className="profile-menu" onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faUser} className="profile-icon" />
                        <span className="user-name">{userName}</span>
                        {dropdownVisible && (
                            <div className="dropdown">
                                <Link to="/dashboard">Tablero</Link>
                                <Link to="/" onClick={handleLogout}>Cerrar sesión</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="login-button" onClick={() => setShowLoginPopup(true)}>Iniciar sesión</button>
                )}
            </div>
            {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
        </header>
    );
};

export default Header;
