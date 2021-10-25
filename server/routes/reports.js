const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Get reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedThread');
        res.json(reports)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get report by ID
router.get('/:id', getReport, (req, res) => {
    res.json(res.report);
});

// Create report
router.post('/', async (req, res) => {
    const report = new Report({
        desc: req.body.desc,
        reportedThread: req.body.reportedThread,
    })
    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete report by ID
router.delete('/:id', getReport, async (req, res) => {
    try {
        await res.report.remove();
        res.json({ message: 'Report deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete all reports by threadID
router.delete('/reportedThread/:id', async (req, res) => {
    try {
        await Report.deleteMany({ reportedThread: (req.params.id) })
        res.json({message: 'All related reports deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function that checks if a report exists
async function getReport(req, res, next) {
    let report;
    try {
        report = await Report.findById(req.params.id).populate('reportedThread');
        if (report == null)
            return res.status(404).json({ message: 'Report does not exist' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.report = report;
    next();
}

module.exports = router;
