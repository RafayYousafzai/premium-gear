import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './styles/CarDetailsSection.css';


const CarDetailsSection = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            const docRef = doc(db, 'vehicles', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setVehicle(docSnap.data());
            }
        };

        fetchVehicleDetails();
    }, [id]);

    if (!vehicle) return <div>Loading...</div>;

    return (
        <div className="car-details-section">
            <table className="car-details-table">
                <tbody>
                    <tr>
                        <td><strong>{vehicle.year}</strong></td>
                        <td>{vehicle.bodyStyle}</td>
                        <td>{vehicle.transmission}</td>
                        <td>{vehicle.doors} Puertas</td>
                    </tr>
                    <tr>
                        <td>{vehicle.seats} Plazas</td>
                        <td>{vehicle.engineDisplacement} cc</td>
                        <td>{vehicle.powerOutput} cv</td>
                        <td>{vehicle.color}</td>
                    </tr>
                    <tr>
                        <td>{vehicle.fuelType}</td>
                        <td>Garantía {vehicle.warranty} meses</td>
                        <td>{vehicle.mileage} km</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CarDetailsSection;
