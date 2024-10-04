import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  CardActions,
} from "@mui/material";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShopContext } from "../../context/ShopContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
export default function ProductList() {
  const { addToCart } = useContext(ShopContext);

  const [products, setCarParts] = useState([]);

  useEffect(() => {
    const fetchCarParts = async () => {
      const carPartsCollection = collection(db, "carParts");
      const carPartsSnapshot = await getDocs(carPartsCollection);
      const carPartsList = carPartsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCarParts(carPartsList);
    };
    fetchCarParts();
  }, []);

  return (
    <>
      <Header />

      <Container
        maxWidth="lg"
        style={{ marginTop: "2rem", minHeight: "100vh" }}
      >
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  sx={{ height: 300, objectFit: "cover" }}
                  image={product.images[0] || "https://via.placeholder.com/140"}
                  title={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", height: "5rem" }}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                  <Link style={{ width: "100%" }} to={`/shop/${product.id}`}>
                    <Button size="small" onClick={() => addToCart(product)}>
                      View
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
