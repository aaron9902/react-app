const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require('./models/User');

//Load Body parser and User
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));  
app.use(bodyParser.json());                         

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
	}).then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err))
    
app.post('/api/users/register', (req,res) => {

const user = new User(req.body)
        

user.save((err, userInfo) =>{
     if(err) return res.json({success: false, err}) 
        return res.status(200).json({   
        success: true
      })
      }) 
})


//login function
app.post('/api/users/login', (req, res) => {
    //1. find the email from the db
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
              loginSuccess: false,
              message: "User with provided email, doesn't exist "
            })
          }
    
        //2. if the email is found, check password 
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch)    //feedback if the password is incorrect
                return res.json({loginSuccess: false, message: "Wrong password" })
            

            //3. if correct, create a token for the user
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);   //notify there is an error (400), send an error msg
                
                //save the token.
                res.cookie("x_auth", user.token)
                .status(200)    //notify its successful
                .json({loginSuccess: true, userId: user._id})

            })    
            
        })
    })
})


//Authentication parts
app.get('/api/users/auth', auth, (req, res) => {    //auth : midleware -> 

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
      })
    })


app.get('/api/users/logout', auth, (req, res) => {
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


app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/api/hello', (req,res) => {
  res.send("heeleleelelelelelelel")
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})