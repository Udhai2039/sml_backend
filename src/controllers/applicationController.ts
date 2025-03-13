// controllers/applicationController.ts
import fs from "fs";
import path from "path";
import { Application } from "../types/application";

const dbPath = path.join(__dirname, "../../src/data/applications.json");

export const getApplications = (): Application[] => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

export const addApplication = (applicationData: Omit<Application, "id" | "createdAt" | "status">) => {
  const applications = getApplications();
  const newApplication: Application = {
    ...applicationData,
    id: applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1,
    createdAt: new Date(),
    status: "Applied",
  };
  applications.push(newApplication);
  fs.writeFileSync(dbPath, JSON.stringify(applications, null, 2));
};

export const updateApplicationStatus = (id: number, status: string): boolean => {
  const applications = getApplications();
  const application = applications.find((app) => app.id === id);
  if (application) {
    application.status = status;
    fs.writeFileSync(dbPath, JSON.stringify(applications, null, 2));
    return true;
  }
  return false;
};

export const withdrawApplication = (id: number): boolean => {
  const applications = getApplications();
  const application = applications.find((app) => app.id === id);
  if (application) {
    application.status = "Withdrawn";
    fs.writeFileSync(dbPath, JSON.stringify(applications, null, 2));
    return true;
  }
  return false;
};
