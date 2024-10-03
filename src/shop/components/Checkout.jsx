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

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      console.log("Payment successful", paymentMethod);
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
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
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
                  <Typography variant="body1">
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
