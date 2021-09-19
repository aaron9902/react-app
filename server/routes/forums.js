const express = require('express');
const router = express.Router();
const Forum  = require('../models/forums');
const Thread = require('../models/threads');

// Root url is '/forums/' (declared in server.js, app.use('/forums', ...))

// Get forums 
//i.e. a GET request at localhost:5000/forums/ will give all the forums from the database
router.get('/', async (req, res) => {
    try {
        const forums = await Forum.find();
        res.json(forums);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get forum by ID 
//i.e. localhost:5000/forums/<some id> will give a forum from the database, searched by its ID
router.get('/:id', getForum, (req, res) => {
    res.json(res.forum);
});

//get forum by name (have to include /name_search as it thinks its searching for ID)
router.get('/name_search/:title', async (req, res) => {
    const threads = await Forum.find({ title: { $regex: (req.params.title), $options: 'i' } });
    res.json(threads);
});

// Get threads by forum ID
router.get('/:id/threads', async (req, res) => {
    const threads = await Thread.find({ forumParent: (req.params.id) }).populate('userParent');
    res.json(threads);
});

// Create forum
router.post('/', async (req, res) => {
    const forum = new Forum({
        title: req.body.title,
        desc: req.body.desc
    })
    try {
        const newForum = await forum.save();
        res.status(201).json(newForum);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update forum by ID
router.patch('/:id', getForum, async (req, res) => {
    if (req.body.title != null) 
        res.forum.title = req.body.title;
    if (req.body.desc != null)
        res.forum.desc = req.body.desc;
    try {
        const updatedForum = await res.forum.save();
        res.json(updatedForum);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

// Delete forum by ID
router.delete('/:id', getForum, async (req, res) => {
    try {
        await res.forum.remove();
        res.json({ message: 'Forum deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper function that checks if a forum exists, if so, returns that forum object
async function getForum(req, res, next) {
    let forum;
    try {
        forum = await Forum.findById(req.params.id);
        if (forum == null)
            return res.status(404).json({ message: 'Forum does not exist' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.forum = forum;
    next();
}

module.exports = router;