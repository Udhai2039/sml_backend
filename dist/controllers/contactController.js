"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.saveContact = exports.getContacts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const contactFilePath = path_1.default.join(__dirname, '../data/contacts.json');
if (!fs_1.default.existsSync(contactFilePath)) {
    fs_1.default.writeFileSync(contactFilePath, JSON.stringify([]));
}
const getContacts = (req, res) => {
    fs_1.default.readFile(contactFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading contact data' });
        }
        res.json(JSON.parse(data));
    });
};
exports.getContacts = getContacts;
const saveContact = (req, res) => {
    const newContact = req.body;
    fs_1.default.readFile(contactFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading contact data' });
        }
        const contacts = JSON.parse(data);
        contacts.push(newContact);
        fs_1.default.writeFile(contactFilePath, JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving contact data' });
            }
            res.status(201).json({ message: 'Contact saved successfully' });
        });
    });
};
exports.saveContact = saveContact;
// New DELETE endpoint
const deleteContact = (req, res) => {
    const { index } = req.params; // Expect index as a URL parameter
    fs_1.default.readFile(contactFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error reading contact data' });
        }
        const contacts = JSON.parse(data);
        const idx = parseInt(index, 10);
        if (isNaN(idx) || idx < 0 || idx >= contacts.length) {
            return res.status(400).json({ message: 'Invalid index' });
        }
        contacts.splice(idx, 1); // Remove the contact at the given index
        fs_1.default.writeFile(contactFilePath, JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving contact data' });
            }
            res.status(200).json({ message: 'Contact deleted successfully' });
        });
    });
};
exports.deleteContact = deleteContact;
