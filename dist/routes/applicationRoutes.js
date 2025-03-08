"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.get('/', (req, res) => {
    res.json((0, applicationController_1.getApplications)());
});
router.post('/', upload.single('resume'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'Resume file is required' });
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
        res.status(201).json({ message: 'Application submitted successfully' });
    }
});
exports.default = router;
