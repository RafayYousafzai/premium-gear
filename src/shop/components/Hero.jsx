import React from "react";
import { Select, MenuItem, Button } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import LockIcon from "@mui/icons-material/Lock";
import FlagIcon from "@mui/icons-material/Flag";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col">
        {/* Navigation bar */}
        <nav className="bg-green-900 text-white  ">
          <ul className="flex justify-around py-2">
            <li className="cursor-pointer">Shop By Make ▼</li>
            <li className="cursor-pointer">Shop By Category ▼</li>
            <li className="cursor-pointer">Shop By Brand ▼</li>
            <li className="cursor-pointer">Gift Items ▼</li>
            <li className="cursor-pointer">Maintenance</li>
          </ul>
        </nav>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            SHOP YOUR VEHICLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <Select className="bg-white" fullWidth displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select Make
              </MenuItem>
            </Select>
            <Select className="bg-white" fullWidth displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select Model
              </MenuItem>
            </Select>
            <Select className="bg-white" fullWidth displayEmpty defaultValue="">
              <MenuItem value="" disabled>
                Select Year
              </MenuItem>
            </Select>
            <Button className="bg-yellow-500" variant="contained">
              SEARCH
            </Button>
            <Button className="bg-yellow-500" variant="contained">
              RESET
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 p-4">
            <img
              src="https://img.freepik.com/premium-photo/black-sports-car-with-license-plate-that-says-s-it_1240491-767.jpg?w=740"
              alt="Vehicle Accessories"
              className="w-full h-96 object-cover mb-4"
            />
            <div className="bg-gray-300 p-2">
              <h3 className="text-xl font-bold text-center">
                SHOP ACCESSORIES BY MAKE
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 p-4 flex flex-col items-center justify-center text-center">
              <LocalShippingIcon
                className="text-green-900 mb-2"
                style={{ fontSize: 80 }}
              />
              <h4 className="font-bold mb-2">FREE SHIPPING</h4>
              <p className="text-sm">
                On orders over $100 within the Contiguous U.S.
              </p>
            </div>
            <div className="bg-gray-200 p-4 flex flex-col items-center justify-center text-center">
              <AssignmentReturnIcon
                className="text-green-900 mb-2"
                style={{ fontSize: 80 }}
              />
              <h4 className="font-bold mb-2">30 DAY RETURNS</h4>
              <p className="text-sm">
                Don't like your product? Simply return within 30 days!
              </p>
            </div>
            <div className="bg-gray-200 p-4 flex flex-col items-center justify-center text-center">
              <LockIcon
                className="text-green-900 mb-2"
                style={{ fontSize: 80 }}
              />
              <h4 className="font-bold mb-2">SAFE PAYMENTS</h4>
              <p className="text-sm">
                Trusted SSL Protection making all payments secure.
              </p>
            </div>
            <div className="bg-gray-200 p-4 flex flex-col items-center justify-center text-center">
              <FlagIcon
                className="text-green-900 mb-2"
                style={{ fontSize: 80 }}
              />
              <h4 className="font-bold mb-2">U.S OPERATED</h4>
              <p className="text-sm">
                Proudly located in NY. All shipped out of 1 location.
              </p>
            </div>
          </div>
        </div>
        <footer className="bg-green-900 mt-10 pb-2 pt-4 ">
          <p className=" text-white font-bold text-3xl text-center">
            Your trusted source for Automotive Accessories and Parts!
          </p>
        </footer>
      </main>
    </div>
  );
}
