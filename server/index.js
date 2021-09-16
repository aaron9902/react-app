const express = require('express')
const app = express()
const port = 6000
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const config = require('./config/key');

//Load Body parser and User
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //remove since its deprecated?

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.use('/api/users', require('./routes/users'));
app.use('/api/forums', require('./routes/forums'));
app.use('/api/threads', require('./routes/threads'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})