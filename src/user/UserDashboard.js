import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./styles/UserStyles.css";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("No user is logged in");
        setLoading(false);
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, "Reservations"),
          where("userId", "==", currentUser.uid)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
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

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <div className="user-dashboard">
      <h1>My Orders</h1>
      <Link to={"/profile"}>
        <Button>Profile</Button>
      </Link>
      <br />
      <br />
      <br />
      <main className="user-content">
        <h2>Welcome, Back!</h2>
        <p>Here you can view your bookings, manage your profile, and more.</p>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="order table">
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderNumber}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
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
      </main>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Order Details
          </Typography>
          {selectedOrder && (
            <div>
              {Object.entries(selectedOrder).map(([key, value]) => (
                <Typography key={key} variant="body1" gutterBottom>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {key === "createdAt" ? formatDate(value) : value}
                </Typography>
              ))}
            </div>
          )}
          <Button onClick={handleCloseModal} startIcon={<CloseIcon />}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserDashboard;
