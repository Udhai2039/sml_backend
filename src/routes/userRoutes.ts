// userRoutes.ts
import express from "express";
import multer from "multer";
import { registerUser, loginUser,getUserProfile,forgotPassword,resetPassword, getAllUsers, updateUser, deleteUser } from "../controllers/usercontrollers";


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
router.get("/user-profile", getUserProfile); 
router.post('/forgot-password', forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", getAllUsers);

router.put("/:id", upload.single("profilePic"), updateUser);
router.delete("/:id", deleteUser);


export default router;

