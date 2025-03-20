"use strict";
// jobController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.addJob = exports.getJobs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jobsFile = path_1.default.join(__dirname, "../data/jobs.json");
const getJobs = () => {
    try {
        const data = fs_1.default.readFileSync(jobsFile, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        // If file doesn't exist or is empty, return empty array
        console.error("Error reading jobs file:", error);
        return [];
    }
};
exports.getJobs = getJobs;
const addJob = (jobData) => {
    const jobs = (0, exports.getJobs)();
    const newJob = Object.assign(Object.assign({}, jobData), { id: jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1 });
    jobs.push(newJob);
    fs_1.default.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
};
exports.addJob = addJob;
const updateJob = (id, updatedJob) => {
    const jobs = (0, exports.getJobs)();
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex !== -1) {
        jobs[jobIndex] = Object.assign(Object.assign({}, jobs[jobIndex]), updatedJob);
        fs_1.default.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
    }
};
exports.updateJob = updateJob;
const deleteJob = (id) => {
    const jobs = (0, exports.getJobs)();
    const filteredJobs = jobs.filter(j => j.id !== id);
    fs_1.default.writeFileSync(jobsFile, JSON.stringify(filteredJobs, null, 2));
};
exports.deleteJob = deleteJob;
