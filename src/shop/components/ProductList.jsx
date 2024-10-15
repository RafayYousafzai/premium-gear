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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top banner */}
      <div className="bg-teal-500 text-white text-center py-2">
        Free Shipping on Orders $100+ in Contiguous U.S
      </div>
      <Header />

      <HeroSection />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
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
