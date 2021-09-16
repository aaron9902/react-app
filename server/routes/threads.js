const express = require('express');
const router = express.Router();
const Thread  = require('../models/threads');

// Get threads
router.get('/', async (req, res) => {
    try {
        const threads = await Thread.find();
        res.json(threads)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get thread by ID
router.get('/:id', getThread, (req, res) => {
    res.json(res.thread);
});

// Get threads by name (have to include /search/ as it think its searching by ID)
router.get('/:id/:name', async (req, res) => {
    const threads = await Thread.find({ 
        forumParent: (req.params.id),
        title: { $regex: (req.params.name) } 
    });
    res.json(threads);
});

// Create thread
router.post('/', async (req, res) => {
    const thread = new Thread({
        title: req.body.title,
        desc: req.body.desc,
        forumParent: req.body.forumParent
    })
    try {
        const newThread = await thread.save();
        res.status(201).json(newThread);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update thread by ID
router.patch('/:id', getThread, async (req, res) => {
    if (req.body.title != null) 
        res.thread.title = req.body.title;
    if (req.body.desc != null)
        res.thread.desc = req.body.desc;
    if (req.body.upvotes != null)
        res.thread.upvotes = req.body.upvotes;
    try {
        const updatedThread = await res.thread.save();
        res.json(updatedThread);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

// Delete thread by ID
router.delete('/:id', getThread, async (req, res) => {
    try {
        await res.thread.remove();
        res.json({ message: 'Thread deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function that checks if a thread exists
async function getThread(req, res, next) {
    let thread;
    try {
        thread = await Thread.findById(req.params.id);
        if (thread == null)
            return res.status(404).json({ message: 'Thread does not exist' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.thread = thread;
    next();
}

module.exports = router;