const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },

    email: {
        type: String,
        trim: true, // No empty space
        unique: 1
    },
    password: {
        type: String,
        minLength: 5
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Thread'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Thread'
    }],
    role: {
        type: Number, // 0 for Normal Users, 1 for Admin
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// Encrypts the password before save. ** Before the index.js's save function works
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {// Must encrypt when changing the password. shouldn't encrypt the password when changing the email
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            // user.password : password typed from the client
            // hash : encrypted password
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash        //swap to hash
                next()
            })
        })
    } else { // Skips when changing the other things
        next()
    }
})

// Defining the function   
userSchema.methods.comparePassword = function (plainPassword, cb) {   //cb : callback function

    // Unable to decrypt the password -> plain password needs to be encrypted and compared.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;

    // Creating token using jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // Decode token
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // Find the user using the decoded user token
        // Compare the decoded token with the database user.

        // Find using ID and token (findOne is Mongodb function)
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err); // If error occurs, send it to call back
            cb(null, user)          // No error -> user info
        })
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User } // This schema can be used from the other files