"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addApplication = exports.getApplications = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, '../../src/data/applications.json');
const getApplications = () => {
    const data = fs_1.default.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};
exports.getApplications = getApplications;
const addApplication = (applicationData) => {
    const applications = (0, exports.getApplications)();
    const newApplication = Object.assign(Object.assign({}, applicationData), { id: applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1, createdAt: new Date() });
    applications.push(newApplication);
    fs_1.default.writeFileSync(dbPath, JSON.stringify(applications, null, 2));
};
exports.addApplication = addApplication;
