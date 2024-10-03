import React, { useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
} from "@mui/material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";

const products = [
  {
    id: 1,
    name: "Brake Pads",
    price: 49.99,
    description: "High-performance brake pads for improved stopping power.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Oil Filter",
    price: 9.99,
    description: "Premium oil filter for enhanced engine protection.",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Spark Plugs",
    price: 19.99,
    description:
      "Iridium spark plugs for better fuel efficiency and performance.",
    image: "/placeholder.svg",
  },
  // Add more products as needed
];

export default function ProductList() {
  const { addToCart } = useContext(ShopContext);
  return (
    <>
      <Header />
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addToCart(product)}
                    style={{ marginTop: "1rem" }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
