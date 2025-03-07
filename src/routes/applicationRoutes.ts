import { Router, Request, Response } from 'express';
import { addApplication, getApplications } from '../controllers/applicationController';
import multer from 'multer';
import path from 'path';
import { Application } from '../types/application';

const router = Router();

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', (req: Request, res: Response) => {
  res.json(getApplications());
});

router.post('/', upload.single('resume'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'Resume file is required' });
  } else {
    const applicationData: Omit<Application, 'id' | 'createdAt'> = {
      jobId: parseInt(req.body.jobId as string),
      applicantName: req.body.name as string,
      email: req.body.email as string,
      phone: req.body.phone as string,
      position: req.body.position as string,
      resume: req.file.path,
      coverLetter: req.body.experience as string,
    };
    addApplication(applicationData);
    res.status(201).json({ message: 'Application submitted successfully' });
  }
});

export default router;