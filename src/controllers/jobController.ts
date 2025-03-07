import { Job } from "../types/job";
import fs from "fs";
import path from "path";

const jobsFile = path.join(__dirname, "../data/jobs.json");
const uploadsDir = path.join(__dirname, "../../uploads/logos"); // Directory for logos

// Ensure uploads/logos directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const getJobs = (): Job[] => {
  const data = fs.readFileSync(jobsFile, "utf-8");
  return JSON.parse(data);
};

export const addJob = (jobData: Omit<Job, "id">, logoFile?: Express.Multer.File): void => {
  const jobs = getJobs();
  const newJob: Job = {
    ...jobData,
    id: jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
    logo: logoFile ? path.join("uploads/logos", logoFile.filename) : "", // Store relative path
  };
  jobs.push(newJob);
  fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
};

export const updateJob = (id: number, updatedJob: Partial<Job>, logoFile?: Express.Multer.File): void => {
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(j => j.id === id);
  if (jobIndex !== -1) {
    if (logoFile) {
      // Optionally delete old logo if it exists
      const oldJob = jobs[jobIndex];
      if (oldJob.logo && fs.existsSync(path.join(__dirname, "../../", oldJob.logo))) {
        fs.unlinkSync(path.join(__dirname, "../../", oldJob.logo));
      }
      jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob, logo: path.join("uploads/logos", logoFile.filename) };
    } else {
      jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob };
    }
    fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
  }
};

export const deleteJob = (id: number): void => {
  const jobs = getJobs();
  const jobToDelete = jobs.find(j => j.id === id);
  if (jobToDelete && jobToDelete.logo && fs.existsSync(path.join(__dirname, "../../", jobToDelete.logo))) {
    fs.unlinkSync(path.join(__dirname, "../../", jobToDelete.logo)); // Delete logo file
  }
  const filteredJobs = jobs.filter(j => j.id !== id);
  fs.writeFileSync(jobsFile, JSON.stringify(filteredJobs, null, 2));
};