import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CarPartsPage = () => {
  const [open, setOpen] = useState(false);
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [partImages, setPartImages] = useState([]); // Handle multiple images
  const [editId, setEditId] = useState(null);
  const [carParts, setCarParts] = useState([]);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPartName("");
    setPartPrice("");
    setPartDescription("");
    setPartImages([]);
    setEditId(null);
  };

  const handleImageUpload = async (files) => {
    const imageUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `carParts/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      imageUrls.push(downloadURL);
    }
    return imageUrls;
  };

  const handleSubmit = async () => {
    if (!partName || !partPrice || !partDescription || !partImages.length)
      return;

    try {
      const imageUrls = await handleImageUpload(partImages);

      if (editId) {
        const partDoc = doc(db, "carParts", editId);
        await updateDoc(partDoc, {
          name: partName,
          price: parseFloat(partPrice),
          description: partDescription,
          images: imageUrls, // Store as an array of image URLs
        });
      } else {
        await addDoc(collection(db, "carParts"), {
          name: partName,
          price: parseFloat(partPrice),
          description: partDescription,
          images: imageUrls, // Store as an array of image URLs
        });
      }

      const carPartsSnapshot = await getDocs(collection(db, "carParts"));
      const carPartsList = carPartsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCarParts(carPartsList);
      handleClose();
    } catch (error) {
      console.error("Error submitting car part:", error);
    }
  };

  const handleEdit = (part) => {
    setPartName(part.name);
    setPartPrice(part.price);
    setPartDescription(part.description);
    setEditId(part.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "carParts", id));
      setCarParts(carParts.filter((part) => part.id !== id));
    } catch (error) {
      console.error("Error deleting car part:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        <AddIcon /> Add Car Part
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Car Part" : "Add Car Part"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            placeholder="Part Name"
            fullWidth
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
          />
          <TextField
            margin="dense"
            placeholder="Price"
            type="number"
            fullWidth
            value={partPrice}
            onChange={(e) => setPartPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            placeholder="Description"
            fullWidth
            value={partDescription}
            onChange={(e) => setPartDescription(e.target.value)}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setPartImages([...e.target.files])} // Handle multiple image files
            style={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup fullWidth>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} color="primary">
              {editId ? "Update" : "Add"}
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Images</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carParts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.name}</TableCell>
                <TableCell>${part.price.toFixed(2)}</TableCell>
                <TableCell>{part.description}</TableCell>
                <TableCell>
                  {part.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={part.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        margin: "5px",
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }}
                    onClick={() => handleEdit(part)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    style={{ height: 40, width: 40, color: "#2980b9" }}
                    onClick={() => handleDelete(part.id)}
                  >
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

export default CarPartsPage;
