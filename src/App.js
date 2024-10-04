import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import HomePage from "./homepage/HomePage";
import Preloader from "./components/Preloader";
import VehicleDetailPage from "./vehicle/VehicleDetailPage";
import CheckoutPage from "./checkout/CheckoutPage";
import ReservationSuccess from "./checkout/ReservationSuccess";
import CustomCars from "./CustomCars/CustomCars";
import AllVehicles from "./AllVehicles/AllVehicles";
import AboutUs from "./about/AboutUs";
import Contact from "./contact/Contact"; // Import the Contact component
import UserProfile from "./user/UserProfile";
import ProductList from "./shop/components/ProductList";
import Cart from "./shop/components/Cart";
import Checkout from "./shop/components/Checkout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const role = docSnap.data().role;
            setRole(role);
            setAuthError(null); // Clear any previous errors
          } else {
            console.error("No such document!");
            setAuthError("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setAuthError("Error fetching user role");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Preloader />; // Show the Preloader component while loading
  }

  if (authError) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login error={authError} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  if (user && role) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Navigate to={`/${role}`} />} />
          <Route path="/signup" element={<Navigate to={`/${role}`} />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/shop/:id" element={<VehicleDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/admin/*"
            element={
              role === "admin" ? <AdminDashboard /> : <Navigate to="/user" />
            }
          />
          <Route
            path="/user/*"
            element={
              role === "user" ? <UserDashboard /> : <Navigate to="/admin" />
            }
          />
          <Route path="/profile/*" element={<UserProfile />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />{" "}
          {/* Route for checkout */}
          <Route
            path="/reservation-success"
            element={<ReservationSuccess />}
          />{" "}
          {/* Route for reservation success */}
          <Route path="/custom-cars" element={<CustomCars />} />{" "}
          {/* Route for CustomCars */}
          <Route path="/cars-in-stock" element={<AllVehicles />} />{" "}
          {/* Route for AllVehicles */}
          <Route path="/about-us" element={<AboutUs />} />{" "}
          {/* Route for AboutUs */}
          <Route path="/contact" element={<Contact />} />{" "}
          {/* Route for Contact */}
          <Route path="*" element={<Navigate to={`/${role}`} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />{" "}
        {/* Route for checkout */}
        <Route
          path="/reservation-success"
          element={<ReservationSuccess />}
        />{" "}
        {/* Route for reservation success */}
        <Route path="/custom-cars" element={<CustomCars />} />{" "}
        {/* Route for CustomCars */}
        <Route path="/cars-in-stock" element={<AllVehicles />} />{" "}
        {/* Route for AllVehicles */}
        <Route path="/about-us" element={<AboutUs />} />{" "}
        {/* Route for AboutUs */}
        <Route path="/contact" element={<Contact />} />{" "}
        {/* Route for Contact */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
