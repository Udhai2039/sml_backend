"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// jobRoutes.ts
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    try {
        res.json((0, jobController_1.getJobs)());
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: "Error retrieving jobs", error: errorMessage });
    }
});
router.post("/", (req, res) => {
    try {
        (0, jobController_1.addJob)(req.body);
        res.status(201).json({ message: "Job added successfully" });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: "Error adding job", error: errorMessage });
    }
});
router.put("/:id", (req, res) => {
    try {
        (0, jobController_1.updateJob)(parseInt(req.params.id), req.body);
        res.json({ message: "Job updated successfully" });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: "Error updating job", error: errorMessage });
    }
});
router.delete("/:id", (req, res) => {
    try {
        (0, jobController_1.deleteJob)(parseInt(req.params.id));
        res.json({ message: "Job deleted successfully" });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ message: "Error deleting job", error: errorMessage });
    }
});
exports.default = router;
