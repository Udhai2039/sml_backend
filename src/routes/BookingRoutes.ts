import express from 'express';
import { getBookings, saveBooking, deleteBooking } from '../controllers/bookingController';

const router = express.Router();

router.get('/', getBookings);
router.post('/', saveBooking);
router.delete('/:index', deleteBooking); // New DELETE route

export default router;