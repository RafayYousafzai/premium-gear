import React from 'react';
import './styles/VideoSection.css';

const VideoSection = () => {
    return (
        <section className="video-section">
            <div className="video-container">
                <video width="100%" height="auto" controls>
                    <source src={process.env.PUBLIC_URL + '/assets/video.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="watermark">
                    <img src={process.env.PUBLIC_URL + '/assets/logo.png'} alt="Watermark Logo" />
                </div>
            </div>
        </section>
    );
}

export default VideoSection;
