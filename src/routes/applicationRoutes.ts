//applicationRoutes.ts
import { Router, Request, Response } from "express";
import { addApplication, getApplications, updateApplicationStatus, withdrawApplication } from "../controllers/applicationController";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", (req: Request, res: Response) => {
  res.json(getApplications());
});

router.post("/", upload.single("resume"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "Resume file is required" });
  } else {
    const applicationData = {
      jobId: parseInt(req.body.jobId as string),
      applicantName: req.body.name as string,
      email: req.body.email as string,
      phone: req.body.phone as string,
      position: req.body.position as string,
      resume: req.file.path,
      coverLetter: req.body.experience as string,
    };
    addApplication(applicationData);
    res.status(201).json({ message: "Application submitted successfully" });
  }
});

router.put("/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const success = updateApplicationStatus(parseInt(id), status);
  if (success) {
    res.status(200).json({ message: "Status updated" });
  } else {
    res.status(404).json({ message: "Application not found" });
  }
});

router.get("/user/:email", (req: Request, res: Response) => {
  const { email } = req.params;
  const applications = getApplications().filter((app) => app.email === email);
  res.json(applications);
});

// Update the DELETE route to PUT for withdrawal
router.put("/:id/withdraw", (req: Request, res: Response) => {
  const { id } = req.params;
  const success = withdrawApplication(parseInt(id));
  if (success) {
    res.status(200).json({ message: "Application withdrawn" });
  } else {
    res.status(404).json({ message: "Application not found" });
  }
});

export default router;