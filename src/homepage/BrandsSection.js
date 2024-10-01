import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './styles/BrandsSection.css';

const BrandsSection = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            const brandsCollection = collection(db, 'brands');
            const brandsSnapshot = await getDocs(brandsCollection);
            const brandsList = brandsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBrands(brandsList.slice(0, 12)); // Limit to 12 brands
        };

        fetchBrands();
    }, []);

    return (
        <section className="brands-section">
            <h2>Nuestros Coches Favoritos</h2>
            <div className="brand-logos">
                {brands.map((brand, index) => (
                    <div key={brand.id} className="brand-item">
                        <img src={brand.image} alt={brand.name} className="brand-image" />
                        <p>{brand.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BrandsSection;
