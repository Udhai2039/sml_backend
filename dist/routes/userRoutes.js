"use strict";
// userRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const usercontrollers_1 = require("../controllers/usercontrollers");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/register", upload.single("profilePic"), usercontrollers_1.registerUser);
router.post("/login", usercontrollers_1.loginUser);
router.post('/forgot-password', usercontrollers_1.forgotPassword);
router.post("/reset-password", usercontrollers_1.resetPassword);
router.get("/", usercontrollers_1.getAllUsers);
// Updated route to fetch full user details for profile view
router.get("/getUserDetails", usercontrollers_1.getUserDetails);
// Update user details (including profile picture) using a PUT request
router.put("/:id", upload.single("profilePic"), usercontrollers_1.updateUser);
router.delete("/:id", usercontrollers_1.deleteUser);
exports.default = router;
