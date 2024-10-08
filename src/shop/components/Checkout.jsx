import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51OCUhgDkrX1S31jquC991u7GCVxn9QhASplr05nYt5AXcIBrr1WgvowkbrLSUyWALHPCBm5LYN444HC6EB62CAXE00jacnUoX3"
);

// Styled components with MUI's 'styled' function
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  fontSize: "1rem",
  fontWeight: 500,
}));

const StyledCardElement = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const fetchUserProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("No user is logged in");
    return null;
  }

  try {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", currentUser.email)
    );
    const userSnapshot = await getDocs(usersQuery);
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      return { ...userData, id: userSnapshot.docs[0].id }; // Return user profile with ID
    } else {
      alert("User does not exist. Please sign up.");
      return null;
    }
  } catch (err) {
    console.log("Error fetching user profile:", err);
    return null;
  }
};

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(ShopContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    // Check if the user is logged in and fetch profile
    const userProfile = await fetchUserProfile();
    if (!userProfile) {
      navigate("/signup"); // Redirect to signup if no user is logged in or exists
      setProcessing(false);
      return;
    }

    // Create payment method using Stripe
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    try {
      // Add order to Firestore, including user information
      await addDoc(collection(db, "carPartsOrders"), {
        items: cart,
        status: "purchased",
        paymentMethodId: paymentMethod.id,
        total,
        user: {
          name: userProfile.name,
          email: userProfile.email,
          userId: userProfile.id,
        },
        createdAt: new Date().toISOString(),
      });

      console.log("Payment successful", paymentMethod);
      clearCart();
      setProcessing(false);

      navigate(`/`);
    } catch (err) {
      setError("Error updating purchase status: " + err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledCardElement>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </StyledCardElement>
      {error && (
        <Typography color="error" style={{ marginBottom: "1rem" }}>
          {error}
        </Typography>
      )}
      <StyledButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!stripe || processing}
      >
        Pay ${total.toFixed(2)}
      </StyledButton>
    </form>
  );
};

export default function Checkout() {
  const { cart } = useContext(ShopContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
              Checkout
            </h2>

            {/* Order Summary */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Order Summary
              </h3>
              <ul className="divide-y divide-gray-300">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="py-1 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Section */}
            <div className="border-t border-gray-300 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Total:</h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <Elements stripe={stripePromise}>
              <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Payment Details
                </h3>
                <CheckoutForm total={total} />
              </div>
            </Elements>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
