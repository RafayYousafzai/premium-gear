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
import { db, storage } from "../firebase"; // Ensure you have both Firestore and Storage initialized
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsCollection = collection(db, "brands");
      const brandsSnapshot = await getDocs(brandsCollection);
      const brandsList = brandsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(brandsList);
    };
    fetchBrands();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBrandName("");
    setBrandImage(null);
    setEditId(null);
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `brands/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async () => {
    if (!brandName || !brandImage) return;

    try {
      const imageUrl = await handleImageUpload(brandImage);

      if (editId) {
        const brandDoc = doc(db, "brands", editId);
        await updateDoc(brandDoc, { name: brandName, image: imageUrl });
      } else {
        await addDoc(collection(db, "brands"), {
          name: brandName,
          image: imageUrl,
        });
      }

      const brandsSnapshot = await getDocs(collection(db, "brands"));
      const brandsList = brandsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(brandsList);
      handleClose();
    } catch (error) {
      console.error("Error submitting brand:", error);
    }
  };

  const handleEdit = (brand) => {
    setBrandName(brand.name);
    setBrandImage({ name: brand.image.split("/").pop() });
    setEditId(brand.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "brands", id));
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        <AddIcon /> Create Brand
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? "Edit Brand" : "Create Brand"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            placeholder="Brand Name"
            fullWidth
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setBrandImage(e.target.files[0])}
            style={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup fullWidth>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {editId ? "Update" : "Create"}
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  <img
                    src={brand.image}
                    alt={brand.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(brand)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(brand.id)}>
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

export default BrandsPage;
