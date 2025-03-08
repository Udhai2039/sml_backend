"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.addJob = exports.getJobs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jobsFile = path_1.default.join(__dirname, "../data/jobs.json");
const uploadsDir = path_1.default.join(__dirname, "../../uploads/logos"); // Directory for logos
// Ensure uploads/logos directory exists
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const getJobs = () => {
    const data = fs_1.default.readFileSync(jobsFile, "utf-8");
    return JSON.parse(data);
};
exports.getJobs = getJobs;
const addJob = (jobData, logoFile) => {
    const jobs = (0, exports.getJobs)();
    const newJob = Object.assign(Object.assign({}, jobData), { id: jobs.length ? Math.max(...jobs.map(j => j.id)) + 1 : 1, logo: logoFile ? path_1.default.join("uploads/logos", logoFile.filename) : "" });
    jobs.push(newJob);
    fs_1.default.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
};
exports.addJob = addJob;
const updateJob = (id, updatedJob, logoFile) => {
    const jobs = (0, exports.getJobs)();
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex !== -1) {
        if (logoFile) {
            // Optionally delete old logo if it exists
            const oldJob = jobs[jobIndex];
            if (oldJob.logo && fs_1.default.existsSync(path_1.default.join(__dirname, "../../", oldJob.logo))) {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, "../../", oldJob.logo));
            }
            jobs[jobIndex] = Object.assign(Object.assign(Object.assign({}, jobs[jobIndex]), updatedJob), { logo: path_1.default.join("uploads/logos", logoFile.filename) });
        }
        else {
            jobs[jobIndex] = Object.assign(Object.assign({}, jobs[jobIndex]), updatedJob);
        }
        fs_1.default.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
    }
};
exports.updateJob = updateJob;
const deleteJob = (id) => {
    const jobs = (0, exports.getJobs)();
    const jobToDelete = jobs.find(j => j.id === id);
    if (jobToDelete && jobToDelete.logo && fs_1.default.existsSync(path_1.default.join(__dirname, "../../", jobToDelete.logo))) {
        fs_1.default.unlinkSync(path_1.default.join(__dirname, "../../", jobToDelete.logo)); // Delete logo file
    }
    const filteredJobs = jobs.filter(j => j.id !== id);
    fs_1.default.writeFileSync(jobsFile, JSON.stringify(filteredJobs, null, 2));
};
exports.deleteJob = deleteJob;
