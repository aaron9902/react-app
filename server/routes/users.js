const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb')

const { auth } = require('../middleware/auth');
const { User } = require('../models/User');
const Thread = require('../models/threads');

//get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user by ID
router.patch('/:id', getUser, async (req, res) => {
  if (req.body.name != null)
    res.user.name = req.body.name;
  if (req.body.email != null)
    res.user.email = req.body.email;
  if (req.body.password != null)
    res.user.password = req.body.password;
  if (req.body.role != null)
    res.user.role = req.body.role;
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//insert/remove upvoted/downvoted thread ID,
router.patch('/vote/:id', getUser, async (req, res) => {
  console.log(req.body.newVoteStatus);
  switch (req.body.newVoteStatus) {
    case 0:
      if (req.body.num == -1) {
        User.updateOne(
          { _id: req.params.id },
          { $pull: { upvotes: req.body.threadID } },
          function (err, docs) {
            if (err) console.log(err)
            else console.log("Removed Upvote")
          }
        );
      } else if (req.body.num == 1) {
        User.updateOne(
          { _id: req.params.id },
          { $pull: { downvotes: req.body.threadID } },
          function (err, docs) {
            if (err) console.log(err)
            else console.log("Updated user: ", docs)
          }
        );
      }
      break;
    case 1:
      if (res.user.downvotes.includes(req.body.threadID)) {
        User.updateOne(
          { _id: req.params.id },
          { $pull: { downvotes: req.body.threadID } },
          function (err, docs) {
            if (err) console.log(err)
            else console.log("Updated user: ", docs)
          }
        );
      }
      res.user.upvotes.push(req.body.threadID);
      await res.user.save();
      break;
    case -1:
      if (res.user.upvotes.includes(req.body.threadID)) {
        User.updateOne(
          { _id: req.params.id },
          { $pull: { upvotes: req.body.threadID } },
          function (err, docs) {
            if (err) console.log(err)
            else console.log("Updated user: ", docs)
          }
        );
      }
      res.user.downvotes.push(req.body.threadID);
      await res.user.save();
      break;
  }
});

//delete a user
router.delete('/delete/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get user by ID
router.get('/search/:id', getUser, (req, res) => {
  res.json(res.user);
});

//get user's name by ID
router.get('/name/:id', getUser, (req, res) => {
  res.json(res.user.name);
});

//get user's created threads if any
router.get('/threads/:id', getUser, async (req, res) => {
  try {
    const threads = await Thread.find({ userParent: (req.params.id) }).populate('forumParent');
    res.json(threads)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get user's upvotes
router.get('/upvotes/:id', getUser, async (req, res) => {
  res.json(res.user.upvotes)
});

//get user's downvotes
router.get('/downvotes/:id', getUser, async (req, res) => {
  res.json(res.user.downvotes);
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