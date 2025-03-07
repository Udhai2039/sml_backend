import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Contact } from '../types/ContactTypes';

const contactFilePath = path.join(__dirname, '../data/contacts.json');

if (!fs.existsSync(contactFilePath)) {
  fs.writeFileSync(contactFilePath, JSON.stringify([]));
}

export const getContacts = (req: Request, res: Response) => {
  fs.readFile(contactFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading contact data' });
    }
    res.json(JSON.parse(data));
  });
};

export const saveContact = (req: Request, res: Response) => {
  const newContact: Contact = req.body;
  fs.readFile(contactFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading contact data' });
    }
    const contacts: Contact[] = JSON.parse(data);
    contacts.push(newContact);
    fs.writeFile(contactFilePath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving contact data' });
      }
      res.status(201).json({ message: 'Contact saved successfully' });
    });
  });
};

// New DELETE endpoint
export const deleteContact = (req: Request, res: Response) => {
  const { index } = req.params; // Expect index as a URL parameter
  fs.readFile(contactFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading contact data' });
    }
    const contacts: Contact[] = JSON.parse(data);
    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0 || idx >= contacts.length) {
      return res.status(400).json({ message: 'Invalid index' });
    }
    contacts.splice(idx, 1); // Remove the contact at the given index
    fs.writeFile(contactFilePath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving contact data' });
      }
      res.status(200).json({ message: 'Contact deleted successfully' });
    });
  });
};