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
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';  // Icon for Additional Info
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import VehicleForm from './VehicleForm';
import AdditionalInfoDialog from './AdditionalInfoDialog';

const ListingsPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filters, setFilters] = useState({
    brand: '',
    year: '',
    status: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    year: '',
    location: '',
    bodyStyle: '',
    transmission: '',
    doors: '',
    seats: '',
    engineDisplacement: '',
    powerOutput: '',
    color: '',
    fuelType: '',
    warranty: '',
    price: '',
    reservationPrice: '',
    status: 'Available',
    mileage: '',  // New Mileage field
    mainImage: null,
    galleryImages: [],
  });
  const [editId, setEditId] = useState(null);

  const fetchVehicles = async () => {
    const vehiclesCollection = collection(db, 'vehicles');
    const vehiclesSnapshot = await getDocs(vehiclesCollection);
    const vehiclesList = vehiclesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setVehicles(vehiclesList);
    setFilteredVehicles(vehiclesList);
  };

  const fetchBrands = async () => {
    const brandsCollection = collection(db, 'brands');
    const brandsSnapshot = await getDocs(brandsCollection);
    const brandsList = brandsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBrands(brandsList);
  };

  useEffect(() => {
    fetchVehicles();
    fetchBrands();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    let filtered = vehicles;
    if (filters.brand) {
      filtered = filtered.filter((vehicle) => vehicle.brand === filters.brand);
    }
    if (filters.year) {
      filtered = filtered.filter((vehicle) => vehicle.year === filters.year);
    }
    if (filters.status) {
      filtered = filtered.filter((vehicle) => vehicle.status === filters.status);
    }
    setFilteredVehicles(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      brand: '',
      year: '',
      location: '',
      bodyStyle: '',
      transmission: '',
      doors: '',
      seats: '',
      engineDisplacement: '',
      powerOutput: '',
      color: '',
      fuelType: '',
      warranty: '',
      price: '',
      reservationPrice: '',
      status: 'Available',
      mileage: '',  // Reset mileage field here
      mainImage: null,
      galleryImages: [],
    });
    setEditId(null);
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setEditId(vehicle.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleAdditionalInfoOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setInfoOpen(true);
  };

  const handleAdditionalInfoClose = () => {
    setInfoOpen(false);
    setSelectedVehicle(null);
  };

  const handleAdditionalInfoSave = async (id, additionalInfo) => {
    const vehicleDoc = doc(db, 'vehicles', id);
    await updateDoc(vehicleDoc, { additionalInfo });
    fetchVehicles();
    handleAdditionalInfoClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add New Vehicle
      </Button>

      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Filter by Brand</InputLabel>
          <Select name="brand" value={filters.brand} onChange={handleFilterChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.name}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Filter by Year"
          type="number"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Filter by Status</InputLabel>
          <Select name="status" value={filters.status} onChange={handleFilterChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Reserved">Reserved</MenuItem>
            <MenuItem value="Sold">Sold</MenuItem>
            <MenuItem value="Coming Soon">Coming Soon</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Mileage (KM)</TableCell> {/* Added Mileage column */}
              <TableCell>Year</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Reservation Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.mileage}</TableCell> {/* Display Mileage */}
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.price}</TableCell>
                <TableCell>{vehicle.reservationPrice}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(vehicle)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(vehicle.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAdditionalInfoOpen(vehicle)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredVehicles.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <VehicleForm
        open={open}
        handleClose={handleClose}
        fetchVehicles={fetchVehicles}
        formData={formData}
        setFormData={setFormData}
        brands={brands}
        editId={editId}
        setEditId={setEditId}
      />

      <AdditionalInfoDialog
        open={infoOpen}
        handleClose={handleAdditionalInfoClose}
        handleSave={handleAdditionalInfoSave}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default ListingsPage;
