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
const users = require('./db/users.json').users ;
const items = require('./db/items.json').items ;
const passport = require('passport') ;
const BasicStrategy = require('passport-http').BasicStrategy ;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtKey = require('./jwt-key.json').key;

app.use(bodyParser.json());

//http basic passport
passport.use(new BasicStrategy(
  function(username, password, done) {
    const userInfo = users.find(user => user.username == username) ;
    if (userInfo == null)
    {
      console.log("username not found") ;
      return done (null, false) ;
    }
    else {
      if (bcrypt.compareSync(password, userInfo.password) == true ) 
      {
        return done (null, userInfo) ;
      }
      console.log("unauthorized, username and password are not matching") ;
      return done(null, false) ;
    }
  }
));


//jwt passport
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtKey;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  const now = Date.now() / 1000;
  if (jwt_payload.exp > now) {
    const userInfo = users.find(user => user.username == jwt_payload.user.username) ;
    if (userInfo != null){
      done(null, userInfo) ;
    }
    else {
      done(null, false)
    }
  }
  else {
    done(null, false)
  }
}));


function validateSchema( schemaName ) {
  return function (req, res, next) {
    const ajv = new Ajv();
    const validate = ajv.compile(schemaName);
    const valid = validate(req.body);
    if (valid == true) {
      next();
    }
    else {
      res.status(400);
      res.send("not ok");
    }
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//user registration with validating the req.body format
app.post('/users/register', validateSchema(registerUserSchema), (req, res) => {
  //check if username exists already
  if (users.find(e => e.username == req.body.username) != null) {
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
      res.status(200);
      res.send('new user created');
    })
  }
})

// //user login with validating the req.body format
// app.post('/login', validateSchema(login), passport.authenticate('basic', {session: false}), (req, res) => {
//   //check if the username can be found from database
//   const dbUser = users.find(e => e.username == req.body.username) ;
//   if (dbUser == null ) {
//     //no --> error, no such user
//     res.status(406) ;
//     res.send("there is no user matching the username");
//   }
//   //yes --> check if the username and password are a mach
//   else {
//     bcrypt.compare(req.body.password, dbUser.password, function (err, result) {
//       //yes --> succesfull login
//       if (result == true) {
//         const body = {
//           id: "1234",
//           username: "username"
//         };
//         const payload = {
//           user: body 
//         };

//         const options = {
//           expiresIn: '1d'
//         }
//         const token = jwt.sign(payload, jwtKey, options);
//         res.status(200) ;
//         return res.json({token})
//       }
//       //no --> error, wrong password
//       else {
//         res.status(401) ;
//         res.send("unauthorized, username and password are not matching") ;
//       }
//     })
//   }    
// })

//user login with validating the req.body format and using basic auth for confirming username&password
app.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
  const body = {
    id: req.user.id,
    username: req.user.username
  };
  const payload = {
    user: body 
  };
  const options = {
    expiresIn: '1d'
  }
  const token = jwt.sign(payload, jwtKey, options);
  res.status(200) ;
  return res.json({token})   
})

//create a new post
app.post('/items/new', validateSchema(itemSchema), passport.authenticate('jwt', {session: false}), (req, res) => {
  //create a new post to database
  const newitem = {
    id: uuid.v4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: {
      zipCode: req.body.location.zipCode,
      city: req.body.location.city
    },
    imageNames: req.body.imageNames,
    askingPrice: req.body.askingPrice,
    deliveryType: {
      shipping: req.body.deliveryType.shipping,
      pickup: req.body.deliveryType.pickup
    },
    sellerId: req.user.id
  }
  
  items.push(newitem);
  res.status(200);
  res.send("ok, new post created");
})

//modify post
app.put('/items/:itemid', validateSchema(itemSchema), (req, res) => {
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