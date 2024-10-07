import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";

export default function Cart() {
  const { removeFromCart, increaseQuantity, decreaseQuantity, cart } =
    useContext(ShopContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Header />
      <Container maxWidth="md" style={{ marginTop: "2rem", minHeight: "70vh" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={`$${(item.price * item.quantity).toFixed(2)}`}
                    />
                    <ListItemSecondaryAction style={{ display: "flex" }}>
                      <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }}
                        edge="start"
                        aria-label="remove"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }}
                        edge="start"
                        aria-label="add"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }}
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Typography variant="h6" style={{ marginTop: "1rem" }}>
              Total: ${total.toFixed(2)}
            </Typography>
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}
