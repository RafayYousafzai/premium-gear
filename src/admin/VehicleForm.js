import React from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Button,
  ButtonGroup,
} from "@mui/material";
import { db, storage } from "../firebase";
import { doc, addDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const VehicleForm = ({
  open,
  handleClose,
  fetchVehicles,
  formData,
  setFormData,
  brands,
  editId,
  setEditId,
}) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.name === "mainImage") {
      setFormData({
        ...formData,
        mainImage: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        galleryImages: [...e.target.files],
      });
    }
  };

  const handleSubmit = async () => {
    if (editId) {
      // Update existing vehicle
      const vehicleDoc = doc(db, "vehicles", editId);
      await updateDoc(vehicleDoc, formData);
    } else {
      // Upload images and create new vehicle
      let mainImageUrl = "";
      const galleryUrls = [];

      if (formData.mainImage) {
        const mainImageRef = ref(
          storage,
          `vehicles/${formData.mainImage.name}`
        );
        const mainUploadTask = uploadBytesResumable(
          mainImageRef,
          formData.mainImage
        );
        mainImageUrl = await new Promise((resolve, reject) => {
          mainUploadTask.on("state_changed", null, reject, async () => {
            const downloadURL = await getDownloadURL(
              mainUploadTask.snapshot.ref
            );
            resolve(downloadURL);
          });
        });
      }

      if (formData.galleryImages.length > 0) {
        for (const file of formData.galleryImages) {
          const galleryRef = ref(storage, `vehicles/gallery/${file.name}`);
          const galleryUploadTask = uploadBytesResumable(galleryRef, file);
          const galleryUrl = await new Promise((resolve, reject) => {
            galleryUploadTask.on("state_changed", null, reject, async () => {
              const downloadURL = await getDownloadURL(
                galleryUploadTask.snapshot.ref
              );
              resolve(downloadURL);
            });
          });
          galleryUrls.push(galleryUrl);
        }
      }

      await addDoc(collection(db, "vehicles"), {
        ...formData,
        mainImage: mainImageUrl,
        galleryImages: galleryUrls,
      });
      fetchVehicles(); // Refresh the list after adding a new vehicle
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editId ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          placeholder="Vehicle Name"
          type="text"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Brand"
          type="text"
          fullWidth
          name="brand"
          select
          value={formData.brand}
          onChange={handleChange}
        >
          {brands.map((brand) => (
            <MenuItem key={brand.id} value={brand.name}>
              {brand.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          placeholder="Year"
          type="number"
          fullWidth
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Location"
          type="text"
          fullWidth
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Body Style"
          type="text"
          fullWidth
          name="bodyStyle"
          value={formData.bodyStyle}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Transmission"
          type="text"
          fullWidth
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Doors"
          type="number"
          fullWidth
          name="doors"
          value={formData.doors}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Seats"
          type="number"
          fullWidth
          name="seats"
          value={formData.seats}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Engine Displacement (cc)"
          type="text"
          fullWidth
          name="engineDisplacement"
          value={formData.engineDisplacement}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Power Output (hp)"
          type="text"
          fullWidth
          name="powerOutput"
          value={formData.powerOutput}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Color"
          type="text"
          fullWidth
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Fuel Type"
          type="text"
          fullWidth
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Warranty (months)"
          type="number"
          fullWidth
          name="warranty"
          value={formData.warranty}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Mileage (KM)" // New Mileage field
          type="number"
          fullWidth
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Price"
          type="number"
          fullWidth
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Reservation Price"
          type="number"
          fullWidth
          name="reservationPrice"
          value={formData.reservationPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          placeholder="Status"
          type="text"
          fullWidth
          name="status"
          value={formData.status}
          onChange={handleChange}
          select
          SelectProps={{
            native: true,
          }}
        >
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
          <option value="Coming Soon">Coming Soon</option>
        </TextField>
        <input
          type="file"
          onChange={handleImageChange}
          name="mainImage"
          style={{ marginTop: "20px" }}
        />
        <input
          type="file"
          onChange={handleImageChange}
          name="galleryImages"
          multiple
          style={{ marginTop: "20px" }}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            {editId ? "Update" : "Create"}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;
