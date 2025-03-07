import express from 'express';
import { saveContact, getContacts, deleteContact } from '../controllers/contactController';

const router = express.Router();

router.post('/', saveContact);
router.get('/', getContacts);
router.delete('/:index', deleteContact); // New DELETE route

export default router;