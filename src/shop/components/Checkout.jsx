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

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51OCUhgDkrX1S31jquC991u7GCVxn9QhASplr05nYt5AXcIBrr1WgvowkbrLSUyWALHPCBm5LYN444HC6EB62CAXE00jacnUoX3"
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      console.log("PaymentMethod", paymentMethod);
      // Here you would typically send the paymentMethod.id to your server
      // to complete the payment. For this example, we'll just log it.
      alert("Payment successful!");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {error && (
        <Typography color="error" style={{ marginTop: "1rem" }}>
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
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom align="center">
            Checkout
          </Typography>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <List>
            {cart.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box mt={2} mb={2}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Box>
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} />
          </Elements>
        </StyledPaper>
      </Container>
      <Footer />
    </>
  );
}
