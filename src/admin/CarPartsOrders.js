/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  CircularProgress,
  Card,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CarPartsOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "carPartsOrders");
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: "20px" }}>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.user?.name || "N/A"}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenModal(order)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>

          {selectedOrder && (
            <Box sx={{ mt: 3, px: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Order Summary
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {selectedOrder.status}
                </Typography>
              </Box>

              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant="body1"
                  gutterBottom
                >
                  <strong>Total:</strong> ${selectedOrder.total}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Ordered Items
              </Typography>

              {selectedOrder.items?.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1">
                      <strong>Name:</strong> {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      <strong>Price:</strong> ${item.price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {item.description}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>

                  {item.images?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Images:</strong>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {item.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Item ${index} Image ${imgIndex}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #ddd",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            startIcon={<CloseIcon />}
            sx={{ mt: 3 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CarPartsOrders;
