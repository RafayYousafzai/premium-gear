import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  ButtonGroup,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const AdditionalInfoDialog = ({ open, handleClose, handleSave, vehicle }) => {
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (vehicle) {
      setAdditionalInfo(vehicle.additionalInfo || "");
    }
  }, [vehicle]);

  const handleSaveClick = () => {
    if (vehicle) {
      handleSave(vehicle.id, additionalInfo);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {`Additional Information for ${vehicle?.brand} ${vehicle?.name}`}
      </DialogTitle>
      <DialogContent style={{ minWidth: "600px", height: "70vh" }}>
        {" "}
        {/* Increase width here */}
        <ReactQuill
          theme="snow"
          value={additionalInfo}
          onChange={setAdditionalInfo}
          style={{ height: "90%" }}
        />
      </DialogContent>
      <DialogActions>
        <ButtonGroup fullWidth>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveClick} variant="contained" color="primary">
            Save
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalInfoDialog;
