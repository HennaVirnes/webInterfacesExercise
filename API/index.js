const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const Ajv = require('ajv').default;
const registerUserSchema = require('./schemas/registerUser.json');
const itemSchema = require('./schemas/newItem.json');

app.use(bodyParser.json());


function validateUsernamePasswordMW (req, res, next) {
  const ajv = new Ajv();
  const validate = ajv.compile(registerUserSchema);
  const valid = validate(req.body);
  if (valid == true) {
    next();
  }
  else {
    res.status(400);
    res.send("not ok");
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

//user registration
app.post('/register', validateUsernamePasswordMW, (req, res) => {
  //check if username is already existing

  //yes --> reject

  //no --> create a new user
  console.log(req.body.username);
  console.log(req.body.password);
  res.send('ok');
})

//user login
app.post('/login', validateUsernamePasswordMW, (req, res) => {
  //check if the username can be found from database
  //no --> error, no such user
  //yes --> check if the username and password are a mach
    //no --> error, wrong password
    //yes --> succesfull login
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})