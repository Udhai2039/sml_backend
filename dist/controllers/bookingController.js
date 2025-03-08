"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.saveBooking = exports.getBookings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bookingFilePath = path_1.default.join(__dirname, '../data/bookings.json');
if (!fs_1.default.existsSync(bookingFilePath)) {
    fs_1.default.writeFileSync(bookingFilePath, JSON.stringify([]));
}
const getBookings = (req, res) => {
    fs_1.default.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading booking data' });
        }
        res.json(JSON.parse(data));
    });
};
exports.getBookings = getBookings;
const saveBooking = (req, res) => {
    const newBooking = req.body;
    fs_1.default.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading booking data' });
        }
        const bookings = JSON.parse(data);
        bookings.push(newBooking);
        fs_1.default.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving booking data' });
            }
            res.status(201).json({ message: 'Booking saved successfully' });
        });
    });
};
exports.saveBooking = saveBooking;
// New DELETE endpoint
const deleteBooking = (req, res) => {
    const { index } = req.params;
    fs_1.default.readFile(bookingFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading booking data' });
        }
        const bookings = JSON.parse(data);
        const idx = parseInt(index, 10);
        if (isNaN(idx) || idx < 0 || idx >= bookings.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }
        bookings.splice(idx, 1);
        fs_1.default.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving booking data' });
            }
            res.status(200).json({ message: 'Booking deleted successfully' });
        });
    });
};
exports.deleteBooking = deleteBooking;
