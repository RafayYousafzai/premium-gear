import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const AdditionalInfoDialog = ({ open, handleClose, handleSave, vehicle }) => {
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    if (vehicle) {
      setAdditionalInfo(vehicle.additionalInfo || '');
    }
  }, [vehicle]);

  const handleSaveClick = () => {
    if (vehicle) {
      handleSave(vehicle.id, additionalInfo);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {`Additional Information for ${vehicle?.brand} ${vehicle?.name}`}
      </DialogTitle>
      <DialogContent style={{ minWidth: '600px' }}> {/* Increase width here */}
        <ReactQuill 
          theme="snow" 
          value={additionalInfo} 
          onChange={setAdditionalInfo} 
          style={{ height: '300px' }} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalInfoDialog;
