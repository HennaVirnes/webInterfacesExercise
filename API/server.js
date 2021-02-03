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
const multer = require('multer') ;
const multerUpload = multer({dest: 'uploads'}) ;
var fs = require('fs');
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

function doesItemExist(id) {;
  const itemInfo = items.find(item => item.id == id) ;
  return itemInfo ;  
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
app.post('/items/new', /*validateSchema(itemSchema),*/ passport.authenticate('jwt', {session: false}), multerUpload.array('photos', 4),  (req, res) => {
  //get the image names
  let imgNames = [];
  if(req.files != null ){
    for (var i = 0; i < req.files.length; i ++) {
      imgNames.push(req.files[i].filename);
    }
  }
   //create a new post to database
  const newItem = {
    id: uuid.v4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: {
      zipCode: req.body.zipCode,
      city: req.body.city
    },
    imageNames: imgNames,
    askingPrice: req.body.askingPrice,
    deliveryType: {
      shipping: req.body.shipping,
      pickup: req.body.pickup
    },
    sellerId: req.user.id
  }
  console.log(newItem)
  items.push(newItem);
  res.status(200);
  res.send("ok, new post created");
})

//modify post
app.put('/items/:itemid', validateSchema(itemSchema), passport.authenticate('jwt', {session: false}), (req, res) => {
  //check if there is a post for the id
  itemInfo = doesItemExist(req.params.itemid) ;
  if (itemInfo != null){
    //check if the user has right to modify the post
    if(req.user.id != itemInfo.sellerId){
      res.status(401) ;
      res.send ("user doesn't have the right to modify this post") ;
    }
    else {
    // yes --> modify the existing post
      for (var i = 0; i<items.length; i++) {
        if (items[i].id == req.params.itemid) {
          items[i].title = req.body.title ;
          items[i].description = req.body.description;
          items[i].category = req.body.category;
          items[i].location = {
            zipCode: req.body.location.zipCode,
            city: req.body.location.city
          };
          items[i].imageNames = req.body.imageNames;
          items[i].askingPrice = req.body.askingPrice;
          items[i].deliveryType = {
            shipping: req.body.deliveryType.shipping,
            pickup: req.body.deliveryType.pickup
          };
          break;
        }
      }
      res.status(200);
      res.send("ok, post modified");
    }
  }
  // no --> error, no such post with the id
  else {
    res.status(406);
    res.send("no item with the id");
  }
})

//delete a post
app.delete('/items/:itemid', passport.authenticate('jwt', {session: false}), (req, res) => {
  //check if there is a post for the id
  itemInfo = doesItemExist(req.params.itemid) ;
  if (itemInfo != null){
    //check if the user has right to delete the post
    if(req.user.id != itemInfo.sellerId){
      //no right to delete the post
      res.status(401) ;
      res.send ("user doesn't have the right to delete this post") ;
    }
    else {
    // yes --> delete it
      //check whether there are any pictures and delete those
      for (var i = 0; i<itemInfo.imageNames.length; i++) {
        if(fs.existsSync('uploads/'+itemInfo.imageNames[i])) {
          fs.unlink('uploads/'+itemInfo.imageNames[i], (err) =>{
            if (err) throw err;
          });
        }
      }
      const index = (items.findIndex(item => item.id == req.params.itemid));
      items.splice(index, 1); 
      res.status(200);
      res.send("ok, post deleted");
    }
  }
  // no --> error, no such post with the id
  else {
    res.status(406);
    res.send("no item with the id");
  }
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