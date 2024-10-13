/* eslint-disable jsx-a11y/img-redundant-alt */
import "./VehicleDetailPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";
import { HeartIcon, MinusIcon, PlusIcon, StarIcon } from "lucide-react";
import { IconButton } from "@mui/material";

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

        <div className=" mr-32">
          <div className="  p-4   rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">
              WeatherTech CupFone
            </h1>
            <p className="text-sm text-gray-600">Brand: WeatherTech</p>

            <div className="flex items-center mt-2">
              <div className="flex">
                <StarIcon className="h-5 w-5 text-gray-300" />
              </div>
              <span className="ml-2 text-sm text-gray-500">No reviews yet</span>
            </div>

            <p className="mt-4 text-2xl font-bold text-gray-900">
              $44.99 - $67.99
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Pay in 4 interest-free payments on purchases of $30-$1,500 with
              PayPal{" "}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">SKU</p>
                <p>CIO-00310</p>
              </div>
              <div>
                <p className="font-semibold">Ready to Ship In:</p>
                <p>Usually 2-4 Business Days</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Applicable Model Years:</p>
                <p>All Makes and Models</p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="product-type"
                className="block text-sm font-medium text-gray-700"
              >
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                id="product-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option>Options</option>
              </select>
            </div>

            <div className="mt-6">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <IconButton
                  type="button"
                  className="size-12 "
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                </IconButton>
                <div className="relative flex items-stretch focus-within:z-10">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    className="bg-white text-center border-transparent rounded-md w-16"
                  />
                </div>
                <IconButton
                  type="button"
                  className="size-12 "
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </IconButton>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                className=" text-sm bg-green-800 border border-transparent rounded-md py-3 px-8 flex items-center justify-center  font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                ADD
              </button>
              <button
                type="button"
                className="flex-none w-[70%] flex items-center justify-center rounded-md border border-gray-300 p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <HeartIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <span className="sr-only">Add to favorites</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-40">
        <h2>Description</h2>
        <p></p>
      </div>

      <Footer />
    </div>
  );
};

export default ShopDetailPage;
