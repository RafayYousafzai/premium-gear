import React, { useContext } from "react";
import { Container, Typography, Button } from "@mui/material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";

export default function Checkout() {
  const { cart } = useContext(ShopContext);

  // Calculate total based on item quantity
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    console.log("Processing payment...");
    // Add your payment processing logic here
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {cart.map((item) => (
          <Typography key={item.id}>
            {item.name} (x{item.quantity}): $
            {(item.price * item.quantity).toFixed(2)}
          </Typography>
        ))}
        <Typography variant="h6" style={{ marginTop: "1rem" }}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          style={{ marginTop: "1rem" }}
        >
          Complete Purchase
        </Button>
      </Container>
      <Footer />
    </>
  );
}
