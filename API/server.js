const express = require('express') ;
const app = express() ;
const port = 3000 ;
const bodyParser = require('body-parser');
const Ajv = require('ajv').default;
const registerUserSchema = require('./schemas/registerUser.json');
const login = require('./schemas/login.json');
const itemSchema = require('./schemas/newItem.json');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid'); 
const users = require('./users.json').users ;

app.use(bodyParser.json());


function validateUsernamePasswordMW (req, res, next) {
  const ajv = new Ajv();
  const validate = ajv.compile(login);
  const valid = validate(req.body);
  if (valid == true) {
    next();
  }
  else {
    res.status(400);
    res.send("some fields are missing OR incorrect");
  }
}

function validateRegistering (req, res, next) {
  const ajv = new Ajv();
  const validate = ajv.compile(registerUserSchema);
  const valid = validate(req.body);
  if (valid == true) {
    next();
  }
  else {
    res.status(400);
    res.send("some fields are missing OR incorrect");
  }
}

function validateItem (req, res, next) {
  const ajv = new Ajv();
  const validate = ajv.compile(itemSchema);
  const valid = validate(req.body);
  if (valid == true) {
    next();
  }
  else {
    res.status(400);
    res.send("not ok");
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//user registration with validating the req.body format
app.post('/users/register', validateRegistering, (req, res) => {
  //check if username exists already
  if (users.find(e => e.username == req.body.username) > 0) {
    //yes --> reject
    res.status(406) ;
    res.send("user already exists");
  }
  //no --> create a new user
  else {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newuser = {
        username: req.body.username,
        password: hash,
        fName: req.body.fName,
        lName: req.body.lName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        id: uuid.v4()
      }
      users.push(newuser);
      res.send('ok');
    })
  }
})

//user login with validating the req.body format
app.post('/login', validateUsernamePasswordMW, (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    console.log(hash);
    });

  //check if the username can be found from database
  const dbUser = users.find(e => e.username == req.body.username) ;
  console.log(dbUser);
  if (dbUser == null ) {
    //no --> error, no such user
    res.status(406) ;
    res.send("there is no user matching the username");
  }
  //yes --> check if the username and password are a mach
  else {
    bcrypt.compare(req.body.password, dbUser.password, function (err, result) {
      //yes --> succesfull login
      if (result == true) {
        res.status(200) ;
        res.send("yaaaay, succesfull login!");
      }
      //no --> error, wrong password
      else {
        res.status(401) ;
        res.send("unauthorized, username and password are not matching") ;
      }
    })
  }    
})

//create a new post
app.post('/items/new', validateItem, (req, res) => {
  //user authentication???
  //create a new post to database
  res.send("ok, new post created");
})

//modify post
app.put('/items/:itemid', validateItem, (req, res) => {
  //user authentication???
  //check if there is a post for the id
  // no --> error, no such a post
  // yes --> modify the existing post
  res.send("ok, post modified");
})

//delete a post
app.delete('/items/:itemid', (req, res) => {
  //user authentication???
  //check if there is a post for the id
  // no --> error, no such a post
  // yes --> delete it
  res.send("ok, post deleted");
})

//get posts
let serverInstance = null;

module.exports = {
  start: function() {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  },
  close: function() {
    serverInstance.close();
  },
}