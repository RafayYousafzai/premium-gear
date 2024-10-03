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
import { styled } from "@mui/material/styles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";

// Placeholder product data
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
];

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 3),
  fontWeight: 500,
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function ProductList() {
  const { addToCart } = useContext(ShopContext);

  return (
    <>
      <Header />
      <Container maxWidth="lg" style={{ marginTop: "2rem", minHeight: "70vh" }}>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  style={{ objectFit: "contain", padding: "1rem" }}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <StyledButton
                    variant="contained"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </StyledButton>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
