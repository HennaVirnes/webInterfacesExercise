const express = require('express') ;
const app = express() ;
const port = process.env.PORT || 80
const bodyParser = require('body-parser');
const Ajv = require('ajv').default;
const registerUserSchema = require('./schemas/registerUser.json');
const login = require('./schemas/login.json');
const itemSchema = require('./schemas/newItem.json');
const imagesToDelete = require('./schemas/imagesToDelete.json') ;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid'); 
const users = require('./db/users.json').users ;
const items = require('./db/items.json').items ;
const multer = require('multer') ;
const multerUpload = multer({dest: 'uploads'}) ;
const fs = require('fs');
const passport = require('passport') ;
const BasicStrategy = require('passport-http').BasicStrategy ;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtKey = process.env.key || require('./jwt-key.json').key;
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret 
})

var storage = new CloudinaryStorage ({
  cloudinary: cloudinary,
  params: {
    folder: 'lumipallo',
  },
});

const parser = multer({storage: storage});

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

//user login using basic auth for confirming username&password and creating a token
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
  const id = req.user.id ;
  res.status(200) ;
  return res.json({token, id})   
})

//create a new post
app.post('/items',validateSchema(itemSchema), passport.authenticate('jwt', {session: false}), (req, res) => {
   //create a new post to database
  const date = new Date();
  const newItem = {
    id: uuid.v4(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: {
      zipCode: req.body.location.zipCode,
      city: req.body.location.city
    },
    imageNames: [],
    askingPrice: req.body.askingPrice,
    deliveryType: {
      shipping: req.body.deliveryType.shipping,
      pickup: req.body.deliveryType.pickup
    },
    created: date,
    sellerId: req.user.id
  }
  console.log(newItem);
  items.push(newItem);
  res.status(200);
  console.log(newItem.id);
  res.json({id:newItem.id}) ;
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
          items[i].askingPrice = req.body.askingPrice;
          items[i].deliveryType = {
            shipping: req.body.deliveryType.shipping,
            pickup: req.body.deliveryType.pickup
          };
          break;
        }
      }
      res.status(200);
      res.json({id:itemInfo.id}) ;
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


app.put('/items/:itemid/pictures', passport.authenticate('jwt', {session: false}), parser.array('photos', 4), (req, res) => {
  itemInfo = doesItemExist(req.params.itemid) ;
  console.log(req);
  if (itemInfo != null) {
    let imgNames = [];
    for (var i = 0; i < req.files.length; i ++) {
      //for saving on the /uploads folder on the server
      // let correctFormat = req.files[0].originalname.split('.').pop() ;
      // let newName = req.files[i].filename + '.' + correctFormat ;
      // fs.rename(req.files[i].path, './uploads/' + newName, function (err) {
      //   if (err) throw err;
      // });
      //imgNames.push(newName);

      let path = req.files[i].path ;
      imgNames.push(path);
    }
    for (var i = 0; i<items.length; i++) {
      if (items[i].id == req.params.itemid) {
        items[i].imageNames = imgNames;
        break;
      }
    }   
    res.status(200);
    res.send('ok, pictures uploaded') 
  }
  // no such post with the id
  else {
    res.status(406);
    res.send("no item with the id");
  }
})

app.delete('/items/:itemid/pictures', validateSchema(imagesToDelete), passport.authenticate('jwt', {session: false}), (req, res) => {
  itemInfo = doesItemExist(req.params.itemid) ;
  console.log(items);

  if (itemInfo != null) {
    for (var i = 0; i<req.body.imageNames.length; i++) {
      //deleting image when it's in server /uploads folder
      // if(fs.existsSync('uploads/'+ req.body.imageNames[i])) {
      //   fs.unlink('uploads/'+ req.body.imageNames[i], (err) =>{
      //     if (err) throw err;
      //   });

      // let correctFormat = req.files[0].originalname.split('.').pop() ;
      // let newName = req.files[i].filename + '.' + correctFormat ;
      // fs.rename(req.files[i].path, './uploads/' + newName, function (err) {
      //   if (err) throw err;
      // });
      let nameFromPath = req.body.imageNames[i].split('/').pop().split('.').shift();
      cloudinary.uploader.destroy('lumipallo/' + nameFromPath) ;      
    }
    for (var i = 0; i<items.length; i++) {
      if (items[i].id == req.params.itemid) {
        for (var i = 0; i<req.body.imageNames.length; i++) {
          const index = (itemInfo.imageNames.findIndex(name => name == req.body.imageNames[i]));
          if (index != null) {
            itemInfo.imageNames.splice(index, 1); 
            console.log('here');
          }
        }
      }
      break;
    } 
    res.status(200);
    //console.log(items) ;
    res.send("pictures deleted succesfully");
  }
  // no such post with the id
  else {
    res.status(406);
    res.send("no item with the id");
  }
})

app.get('/items/:userid', (req, res) => {
  let usersItems = [] ;
  for ( let i = 0; i < items.length; i ++) {
    if (items[i].sellerId == req.params.userid) {
      usersItems.push(items[i]);
    }
  }
  res.status(200);
  console.log(usersItems);
  res.json(usersItems);
})



//get posts
// app.get('/items', (req, res) => {
//   console.log(items);
//   let searchFrom = items ;
//   let searchedItems = []
//   console.log(req.query) ;
//   if (req.query.category != null) {
//     for (var i = 0 ; i < searchFrom.length; i++) {
//       if(searchFrom[i].category == req.query.category) {
//         searchedItems.push(items[i])
//       }
//     }
//     console.log(searchFrom.category) ;
//     console.log(req.query.category) ;
//     console.log("category") ;
//     console.log(searchedItems) ;
//   }
//   if (searchedItems.length >= 1) {
//     searchFrom = searchedItems
//   }
//   if(req.query.city != null) {
//     for (var i = 0 ; i < searchFrom.length; i++) {
//       if(searchFrom[i].city == req.query.city) {
//         searchedItems.push(items[i])
//       }
//     }
//     console.log("city") ;
//     console.log(searchedItems) ;
//   }
//   if (searchedItems.length >= 1) {
//     searchFrom = searchedItems
//   }
//   if(req.query.time != null) {
//     for (var i = 0 ; i < searchFrom.length; i++) {
//       if(searchFrom[i].time >= req.query.time) {
//         searchedItems.push(items[i])
//       }
//     }
//     console.log("time") ;
//     console.log(searchedItems) ;
//   }
//   if (searchedItems.length >= 1) {
//     console.log("final after searc")
//     res.json(searchedItems) ;
//   }
//   else {
//     console.log("final without searc")
//     res.json(items) ;
//   }
// })
function searchItemsBy(searchFrom, searchName, operator, searchBy1, searchBy2 ) {
  var searchResult = [] ;
  var equal = function(first, second) {
    return first == second ;
  }
  var bigger = function(first, second) {
    return first >= second ;
  }
  var chosenOperator = equal ;
 
  if (operator == 'bigger') {
    chosenOperator = bigger ;
  }

  if (searchBy2 != null) {
   searchResult = searchFrom.filter(item => chosenOperator(item[searchBy1][searchBy2].toLowerCase(), searchName.toLowerCase()) );
  }
  else {
    searchResult = searchFrom.filter(item => chosenOperator(item[searchBy1].toLowerCase(), searchName.toLowerCase())) ;
  }  
  return searchResult
  // for (var i = 0 ; i < searchFrom.length; i++) {
  //   console.log(searchFrom[i][searchBy]);

  //   if(searchFrom[i].searchBy == searchBy) {
  //     searchedItems.push(searchFrom[i])
  //   }
  // }
  // return searchedItems
}

//get items, also searching by category, city or time is possible
app.get('/items', (req, res) => {
    var listOfSearchedItems = [] ;
    var itemListForSearching = items ;
    var numberOfSearches = 0 ;
    if (req.query.category != null) {
      listOfSearchedItems = searchItemsBy(itemListForSearching, req.query.category,'equal', 'category') ;
      numberOfSearches ++ ;
    }
    if(numberOfSearches != 0) {itemListForSearching = listOfSearchedItems}
    if (req.query.city != null) {
      listOfSearchedItems = searchItemsBy(itemListForSearching, req.query.city, 'equal', 'location', 'city') ;
      numberOfSearches ++ ;
    }
    if(numberOfSearches != 0) {itemListForSearching = listOfSearchedItems}
    if (req.query.time != null) {
      listOfSearchedItems = searchItemsBy(itemListForSearching, req.query.time, 'bigger', 'created') ; 
      numberOfSearches ++ ;
    }
    if (numberOfSearches > 0) {
      res.json(listOfSearchedItems) ;
    }
    else {
      res.json(items);
    }
  })

  app.get('/cities', (req,res) => {
    const cities = [] ;
    for (let i = 0; i< items.length; i++) {
      if (!cities.includes(items[i].location.city)) {
        cities.push(items[i].location.city)
      }
    }
    res.status(200) ;
    res.json(cities);
  })



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