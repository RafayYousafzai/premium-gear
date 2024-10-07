import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Cart() {
  const { removeFromCart, increaseQuantity, decreaseQuantity, cart } =
    useContext(ShopContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log({cart});
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          Your Cart
        </h1>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-300">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-6 flex flex-col sm:flex-row justify-between items-center bg-white shadow-lg rounded-lg p-6 mb-6"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item?.images[0]} // Add image URL for better visualization
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.name} (x{item.quantity})
                      </h2>
                      <p className="text-gray-500 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-150"
                      aria-label="Decrease quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-150"
                      aria-label="Increase quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition duration-150"
                      aria-label="Remove item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col items-center justify-between sm:flex-row">
              <h2 className="text-2xl font-bold text-gray-900">
                Total: ${total.toFixed(2)}
              </h2>
              <Link
                to="/checkout"
                className="mt-4 sm:mt-0 px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
