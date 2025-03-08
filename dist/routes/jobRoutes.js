"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json((0, jobController_1.getJobs)());
});
router.post("/", (req, res) => {
    (0, jobController_1.addJob)(req.body);
    res.status(201).json({ message: "Job added successfully" });
});
router.put("/:id", (req, res) => {
    (0, jobController_1.updateJob)(parseInt(req.params.id), req.body);
    res.json({ message: "Job updated successfully" });
});
router.delete("/:id", (req, res) => {
    (0, jobController_1.deleteJob)(parseInt(req.params.id));
    res.json({ message: "Job deleted successfully" });
});
exports.default = router;
