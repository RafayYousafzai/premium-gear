import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './styles/AdditionalInfoSection.css';

const AdditionalInfoSection = () => {
    const { id } = useParams();
    const [additionalInfo, setAdditionalInfo] = useState('');

    useEffect(() => {
        const fetchVehicleAdditionalInfo = async () => {
            const docRef = doc(db, 'vehicles', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setAdditionalInfo(docSnap.data().additionalInfo);
            }
        };

        fetchVehicleAdditionalInfo();
    }, [id]);

    return (
        <div className="additional-info-section">
            <h2>Comentarios del anunciante</h2>
            <div 
                className="additional-info-content" 
                dangerouslySetInnerHTML={{ __html: additionalInfo }} 
            />
        </div>
    );
};

export default AdditionalInfoSection;
