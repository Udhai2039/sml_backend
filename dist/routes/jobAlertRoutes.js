"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// jobAlertRoutes.ts
const express_1 = __importDefault(require("express"));
const jobAlertController_1 = require("../controllers/jobAlertController");
const router = express_1.default.Router();
// POST endpoint for creating a job alert
router.post('/', jobAlertController_1.saveJobAlert);
// GET endpoint for fetching job alerts
router.get('/', jobAlertController_1.getJobAlerts);
exports.default = router;
