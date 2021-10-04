const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const Userss = require('../models/Userss');

// @route   POST api/userss
// @desc    Register a user
// @access  Public
router.post('/', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Include valid email').isEmail(),
    body('password', 'Password must have at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let userss = await Userss.findOne({ email });

        if(userss) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        userss = new Userss({
            name,
            email,
            password
        });
    // Hashing user password
        const salt = await bcrypt.genSalt(10);

        userss.password = await bcrypt.hash(password, salt);

        await userss.save();

        const payload = {
            userss: {
                id: userss.id
            }
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/userss
// @desc    Get all user
// @access  Private
router.get('/',  async (req, res) =>{
    try {
        const usersss = await Userss.find().sort({ date: -1 });
        res.json(usersss);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/userss/:id
// @desc    Update user
// @access  Private
router.put('/:id', async (req, res) =>{
    const { name, email, password } = req.body;

    // Create User object
    const userssFields = {};
    if(name) userssFields.name = name;
    if(email) userssFields.email = email;
    if(password) userssFields.password = password;

    try {
        let userss = await Userss.findById(req.params.id);

        if(!userss) return res.status(404).json({ msg: 'User not found' });

        userss = await Userss.findByIdAndUpdate(req.params.id, 
            { $set: userssFields},
            { new: true });
            
            res.json(userss);
            
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/userss/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', async (req, res) =>{
    try {
        let userss = await Userss.findById(req.params.id);

        if(!userss) return res.status(404).json({ msg: 'User not found' });

    await Userss.findByIdAndRemove(req.params.id);       
            
        res.json({ msg: 'User Deleted' });
            
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;