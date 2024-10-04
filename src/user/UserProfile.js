import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  ButtonGroup,
} from "@mui/material";
import "./styles/ProfileStyles.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("No user is logged in");
        setLoading(false);
        return;
      }

      try {
        const usersQuery = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
        const userSnapshot = await getDocs(usersQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserProfile({ ...userData, id: userSnapshot.docs[0].id });
        } else {
          setError("No user profile found");
        }
      } catch (err) {
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => setEditable(!editable);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", userProfile.id);
      await updateDoc(userRef, { ...userProfile });
      setEditable(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="profile-container">
      {userProfile && (
        <Box className="profile-details">
          <Typography variant="h4" gutterBottom>
            {editable ? "Edit Profile" : `${userProfile.name}'s Profile`}
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={userProfile.name}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={userProfile.email}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            name="dob"
            value={userProfile.dob}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={userProfile.phone}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="DNI"
            name="dni"
            value={userProfile.dni}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Role"
            name="role"
            value={userProfile.role}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Street"
            name="street"
            value={userProfile.street}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="city"
            value={userProfile.city}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Country"
            name="country"
            value={userProfile.country}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Zip Code"
            name="zipCode"
            value={userProfile.zipCode}
            onChange={handleInputChange}
            disabled={!editable}
            fullWidth
            margin="normal"
          />

          <Box className="button-group">
            {editable ? (
              <ButtonGroup fullWidth>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
                <Button variant="outlined" onClick={handleEditToggle}>
                  Cancel
                </Button>
              </ButtonGroup>
            ) : (
              <Button variant="contained" onClick={handleEditToggle}>
                Edit Profile
              </Button>
            )}
          </Box>

          <button onClick={handleLogout}>Logout</button>
        </Box>
      )}
    </Box>
  );
};

export default UserProfile;
