import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardPage from "./DashboardPage";
import BrandsPage from "./BrandsPage";
import ListingsPage from "./ListingsPage";
import UsersPage from "./UsersPage";
import ReportsPage from "./ReportsPage";
import logo from "../assets/logo.png";
import CarPartsPage from "./CarParts";
import CarPartsOrders from "./CarPartsOrders";

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#333333",
            color: "#fff",
          },
        }}
      >
        <div style={{ padding: "10px", textAlign: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "80%", margin: "0 auto", display: "block" }}
          />
        </div>
        <List>
          <ListItem button component={Link} to="/admin/PartsOrders">
            <ListItemIcon>
              <DashboardIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Parts Orders" />
          </ListItem>
          <ListItem button component={Link} to="/admin">
            <ListItemIcon>
              <DashboardIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/brands">
            <ListItemIcon>
              <BuildIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Brands" />
          </ListItem>
          <ListItem button component={Link} to="/admin/listings">
            <ListItemIcon>
              <DirectionsCarIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Listings" />
          </ListItem>
          <ListItem button component={Link} to="/admin/users">
            <ListItemIcon>
              <PeopleIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/admin/reports">
            <ListItemIcon>
              <AssessmentIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>{" "}
          <ListItem button component={Link} to="/admin/CarParts">
            <ListItemIcon>
              <AssessmentIcon style={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="Car Parts" />
          </ListItem>
        </List>
      </Drawer>

      <main style={{ flexGrow: 1, padding: "24px" }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/PartsOrders" element={<CarPartsOrders />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/CarParts" element={<CarPartsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
