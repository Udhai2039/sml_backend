// jobAlertController.ts
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const alertsFilePath = path.join(__dirname, '../data/jobAlerts.json');

// Initialize file if it doesn't exist
if (!fs.existsSync(alertsFilePath)) {
  fs.writeFileSync(alertsFilePath, JSON.stringify([]));
}

export const saveJobAlert = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  fs.readFile(alertsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error reading job alerts' });
      return;
    }
    const alerts = JSON.parse(data);
    alerts.push({ email });
    fs.writeFile(alertsFilePath, JSON.stringify(alerts, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving job alert' });
        return;
      }
      res.status(201).json({ message: 'Job alert created successfully' });
    });
  });
};

export const getJobAlerts = (req: Request, res: Response, next: NextFunction): void => {
  fs.readFile(alertsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error reading job alerts' });
      return;
    }
    const alerts = JSON.parse(data);
    res.status(200).json(alerts);
  });
};
