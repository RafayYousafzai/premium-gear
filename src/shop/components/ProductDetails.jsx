/* eslint-disable jsx-a11y/img-redundant-alt */
import { FaCalculator, FaTruck, FaShieldAlt } from "react-icons/fa";
import "../../vehicle/styles/VehicleDetailPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";

const ShopDetailPage = () => {
  const { addToCart } = useContext(ShopContext);
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, "carParts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVehicle(docSnap.data());
        } else {
          console.error("Vehicle not found!");
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleNextImage = () => {
    if (vehicle && vehicle.images) {
      setCurrentImage((prevIndex) =>
        prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (vehicle && vehicle.images) {
      setCurrentImage((prevIndex) =>
        prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handlePurchaseClick = (vehicle) => {
    addToCart(vehicle);
    navigate(`/checkout`);
  };

  if (!vehicle) return null;

  return (
    <div className="vehicle-detail-page">
      <Header />
      <div className="vehicle-detail-main">
        <div className="left-section">
          <div className="vehicle-gallery-section">
            <div className="gallery-container">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="main-image-container">
                  <img
                    src={vehicle.images[currentImage]}
                    alt={`${vehicle.name} image`}
                    className="main-image"
                  />
                  <button
                    className="prev-arrow"
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                  >
                    ‹
                  </button>
                  <button
                    className="next-arrow"
                    onClick={handleNextImage}
                    aria-label="Next Image"
                  >
                    ›
                  </button>
                </div>
              ) : (
                <div>No images available</div>
              )}

              {vehicle.images && vehicle.images.length > 1 && (
                <div className="thumbnail-container">
                  {vehicle.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${vehicle.name} thumbnail ${index + 1}`}
                      className={`thumbnail ${
                        index === currentImage ? "active" : ""
                      }`}
                      onClick={() => setCurrentImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div class="max-w-md p-4 mx-auto space-y-4 border rounded-md">
            <h1 class="text-xl font-bold">{vehicle.brand}</h1>
            <p class="text-sm text-muted-foreground"> {vehicle.name}</p>

            <p class="text-2xl font-bold text-primary">€{vehicle.price}</p>

            <div class="space-y-1">
              <div class="flex justify-between">
                <p class="font-medium">SKU:</p>
                <p>ZAA-002</p>
              </div>
              <div class="flex justify-between">
                <p class="font-medium">Ready to Ship In:</p>
                <p>Usually 2-4 Business Days</p>
              </div>
              <div class="flex justify-between">
                <p class="font-medium">Applicable Model Years:</p>
                <p>All Makes and Models</p>
              </div>
              <div class="flex justify-between">
                <p class="font-medium">Product Notes:</p>
                <p>Comes as a Set of 4</p>
              </div>
            </div>
            <div class="space-y-2">
              <button
                className="action-button"
                onClick={() => handlePurchaseClick(vehicle)}
              >
                Buy Now
              </button>{" "}
              <button
                className="action-button"
                onClick={() => addToCart(vehicle)}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopDetailPage;
