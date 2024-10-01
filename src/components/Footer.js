import React from 'react';
import './styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 Premium Gear. All rights reserved.</p>
            <nav className="footer-nav">
                <ul>
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-of-service">Terms of Service</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
