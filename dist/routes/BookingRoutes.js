"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
router.get('/', bookingController_1.getBookings);
router.post('/', bookingController_1.saveBooking);
router.delete('/:index', bookingController_1.deleteBooking); // New DELETE route
exports.default = router;
