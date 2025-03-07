import { Router } from "express";
import { addJob, getJobs, updateJob, deleteJob } from "../controllers/jobController";

const router = Router();

router.get("/", (req, res) => {
  res.json(getJobs());
});

router.post("/", (req, res) => {
  addJob(req.body);
  res.status(201).json({ message: "Job added successfully" });
});

router.put("/:id", (req, res) => {
  updateJob(parseInt(req.params.id), req.body);
  res.json({ message: "Job updated successfully" });
});

router.delete("/:id", (req, res) => {
  deleteJob(parseInt(req.params.id));
  res.json({ message: "Job deleted successfully" });
});

export default router;