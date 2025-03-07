import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Booking } from '../types/bookingTypes';

const bookingFilePath = path.join(__dirname, '../data/bookings.json');

if (!fs.existsSync(bookingFilePath)) {
  fs.writeFileSync(bookingFilePath, JSON.stringify([]));
}

export const getBookings = (req: Request, res: Response) => {
  fs.readFile(bookingFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading booking data' });
    }
    res.json(JSON.parse(data));
  });
};

export const saveBooking = (req: Request, res: Response) => {
  const newBooking: Booking = req.body;
  fs.readFile(bookingFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading booking data' });
    }
    const bookings: Booking[] = JSON.parse(data);
    bookings.push(newBooking);
    fs.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving booking data' });
      }
      res.status(201).json({ message: 'Booking saved successfully' });
    });
  });
};

// New DELETE endpoint
export const deleteBooking = (req: Request, res: Response) => {
  const { index } = req.params;
  fs.readFile(bookingFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading booking data' });
    }
    const bookings: Booking[] = JSON.parse(data);
    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0 || idx >= bookings.length) {
      return res.status(400).json({ message: 'Invalid index' });
    }
    bookings.splice(idx, 1);
    fs.writeFile(bookingFilePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving booking data' });
      }
      res.status(200).json({ message: 'Booking deleted successfully' });
    });
  });
};