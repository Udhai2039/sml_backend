// userRoutes.ts

import express from "express";
import multer from "multer";
import { 
  registerUser, 
  loginUser, 
  forgotPassword,
  resetPassword, 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getUserDetails 
} from "../controllers/usercontrollers";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.post('/forgot-password', forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", getAllUsers);

// Updated route to fetch full user details for profile view
router.get("/getUserDetails", getUserDetails);

// Update user details (including profile picture) using a PUT request
router.put("/:id", upload.single("profilePic"), updateUser);

router.delete("/:id", deleteUser);

export default router;
