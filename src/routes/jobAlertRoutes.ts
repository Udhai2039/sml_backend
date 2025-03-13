// jobAlertRoutes.ts
import express from 'express';
import { saveJobAlert, getJobAlerts } from '../controllers/jobAlertController';

const router = express.Router();

// POST endpoint for creating a job alert
router.post('/', saveJobAlert);

// GET endpoint for fetching job alerts
router.get('/', getJobAlerts);

export default router;
