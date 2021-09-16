const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');
const { User } = require('../models/User');


//get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get user by ID
router.get('/search/:id', getUser, (req, res) => {
    res.json(res.user);
});

router.post('/register', (req, res) => {

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

//login function
router.post('/login', (req, res) => {
    //1. find the email from the db
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "User with provided email, doesn't exist "
            })
        }

        //2. if the email is found, check password 
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)    //feedback if the password is incorrect
                return res.json({ loginSuccess: false, message: "Wrong password" })


            //3. if correct, create a token for the user
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);   //notify there is an error (400), send an error msg

                //save the token.
                res.cookie("x_auth", user.token)
                    .status(200)    //notify its successful
                    .json({ loginSuccess: true, userId: user._id })

            })

        })
    })
})

//role 1 Admin
//role 0 general users

//Authentication parts
router.get('/auth', auth, (req, res) => {    //auth : midleware -> 

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    })
})

router.get('/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})

// Helper function that checks if a user exists, if so, returns that user object
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null)
            return res.status(404).json({ message: 'User does not exist' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}

module.exports = router;