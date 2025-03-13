"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobAlerts = exports.saveJobAlert = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const alertsFilePath = path_1.default.join(__dirname, '../data/jobAlerts.json');
// Initialize file if it doesn't exist
if (!fs_1.default.existsSync(alertsFilePath)) {
    fs_1.default.writeFileSync(alertsFilePath, JSON.stringify([]));
}
const saveJobAlert = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    fs_1.default.readFile(alertsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error reading job alerts' });
            return;
        }
        const alerts = JSON.parse(data);
        alerts.push({ email });
        fs_1.default.writeFile(alertsFilePath, JSON.stringify(alerts, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error saving job alert' });
                return;
            }
            res.status(201).json({ message: 'Job alert created successfully' });
        });
    });
};
exports.saveJobAlert = saveJobAlert;
const getJobAlerts = (req, res, next) => {
    fs_1.default.readFile(alertsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error reading job alerts' });
            return;
        }
        const alerts = JSON.parse(data);
        res.status(200).json(alerts);
    });
};
exports.getJobAlerts = getJobAlerts;
