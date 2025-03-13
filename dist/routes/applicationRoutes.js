"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//applicationRoutes.ts
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/", (req, res) => {
    res.json((0, applicationController_1.getApplications)());
});
router.post("/", upload.single("resume"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "Resume file is required" });
    }
    else {
        const applicationData = {
            jobId: parseInt(req.body.jobId),
            applicantName: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            position: req.body.position,
            resume: req.file.path,
            coverLetter: req.body.experience,
        };
        (0, applicationController_1.addApplication)(applicationData);
        res.status(201).json({ message: "Application submitted successfully" });
    }
});
router.put("/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const success = (0, applicationController_1.updateApplicationStatus)(parseInt(id), status);
    if (success) {
        res.status(200).json({ message: "Status updated" });
    }
    else {
        res.status(404).json({ message: "Application not found" });
    }
});
router.get("/user/:email", (req, res) => {
    const { email } = req.params;
    const applications = (0, applicationController_1.getApplications)().filter((app) => app.email === email);
    res.json(applications);
});
// Update the DELETE route to PUT for withdrawal
router.put("/:id/withdraw", (req, res) => {
    const { id } = req.params;
    const success = (0, applicationController_1.withdrawApplication)(parseInt(id));
    if (success) {
        res.status(200).json({ message: "Application withdrawn" });
    }
    else {
        res.status(404).json({ message: "Application not found" });
    }
});
exports.default = router;
