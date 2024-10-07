import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import HeroSection from "./Hero";

export default function ProductList() {
  const navigate = useNavigate();

  const { addToCart } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "carParts");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setFilteredProducts(productsList);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        priceFilter === "" || product.price <= parseInt(priceFilter);
      const matchesCategory =
        categoryFilter === "" || product.category === categoryFilter;
      const matchesMake = make === "" || product.make === make;
      const matchesModel = model === "" || product.model === model;
      const matchesYear = year === "" || product.year === year;
      return (
        matchesSearch &&
        matchesPrice &&
        matchesCategory &&
        matchesMake &&
        matchesModel &&
        matchesYear
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, priceFilter, categoryFilter, make, model, year, products]);

  const handleVehicleSearch = () => {
    // Implement vehicle search functionality here
    console.log("Searching for:", { make, model, year });
  };

  const handleVehicleReset = () => {
    setMake("");
    setModel("");
    setYear("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <HeroSection />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-transparent p-4  mb-6 w-full">
              <div className="flex flex-wrap gap-2 justify-between">
                <h2 className="text-xl font-bold mt-1 text-[#0A3D3F] mb-4">
                  SHOP YOUR VEHICLE
                </h2>
                <div className="relative">
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="appearance-none  text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select Make</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="-mt-3 h-4 w-4" />
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="appearance-none  text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select Model</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="-mt-3 h-4 w-4" />
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="appearance-none  text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select Year</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="-mt-3 h-4 w-4" />
                  </div>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </div>
                <div className="flex space-x-4 w-full sm:w-auto">
                  <select
                    className="w-full py-0  sm:w-auto px-4 h-10 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="">All Prices</option>
                    <option value="50">Under $50</option>
                    <option value="100">Under $100</option>
                    <option value="200">Under $200</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden shadow-sm rounded-lg"
                >
                  <img
                    className="h-48 w-full object-cover"
                    src={product.images[0] || "https://via.placeholder.com/300"}
                    alt={product.name}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                    <p className="mt-2 text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 w-[60%] bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/shop/${product.id}`)}
                        className="px-4 py-2 w-[40%] bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
