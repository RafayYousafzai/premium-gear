import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import VideoSection from './VideoSection';
import TextButtonSection from './TextButtonSection';
import TwoColumnSection from './TwoColumnSection';
import BrandsSection from './BrandsSection';
import VehicleDisplaySection from './VehicleDisplaySection';
import StatsSection from './StatsSection'; // Import the new StatsSection component

const HomePage = () => {
    return (
        <div className="homepage">
            <Header />
            <main className="main-content">
                <VideoSection />
                <TextButtonSection />
                <TwoColumnSection />
                <BrandsSection />
                <VehicleDisplaySection />
                <StatsSection /> {/* Added the StatsSection component here */}
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;
