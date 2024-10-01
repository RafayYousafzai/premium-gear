import React, { useEffect, useState } from 'react';
import './styles/ProgressBar.css';

const ProgressBar = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = window.scrollY;
        const scrollPercentage = (scroll / totalHeight) * 100;
        setScrollPosition(scrollPercentage);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                style={{ height: `${scrollPosition}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
