import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const ViewListingsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      const vehiclesCollection = collection(db, 'vehicles');
      const vehiclesSnapshot = await getDocs(vehiclesCollection);
      const vehiclesList = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehiclesList);
    };
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/listings/edit/${id}`);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => navigate('/admin/listings/create')}>
        Add New Vehicle
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Reservation Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.year} {vehicle.location}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.price}</TableCell>
                <TableCell>{vehicle.reservationPrice}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell align="right">
                  <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }} onClick={() => handleEdit(vehicle.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }} onClick={() => handleDelete(vehicle.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewListingsPage;
