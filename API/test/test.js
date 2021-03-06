const chai = require('chai');
const expect = require('chai').expect ;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv')) ;
const server = require('../server');
const apiAddress = "http://localhost:3000" ;
let token = "";
let itemId = "123e4567-e89b-12d3-a456-426614174008";
const userCreatedSchema = require('./schemas/usercreated.json');


describe("demonstrating of tests", function() {
  before(function() {
    server.start();
  });

  after(function() {
    server.close();
  })

  describe ('Testing route /user/register', function() {
    it('Should return status 200 with correct request', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(200);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should return status 406 with submitting an username that is in use', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(406);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should return status 400 with additional fields in request body', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "titityy",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe",
        additionalInfo: "This is something extra"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should return status 400 with missing fields in request body', async function() {
      //missing username
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      //missing password
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "titityy2",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      //missing last name
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "tatatuu",
        password: "pa$$word",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      //missing phonenumber
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "titityy3",
        password: "pa$$word",
        lName: "John",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
            //missing email
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "titityy4",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
            //missing firstname
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "titityy5",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should return status 400 with incorrect datatype in request body', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: 3,
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas6",
        password: 2,
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas7",
        password: "pa$$word",
        lName: 3,
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas8",
        password: "pa$$word",
        lName: "John",
        phoneNumber: 3,
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas9",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: 2,
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas10",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: 2
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if username is less than 2 characters', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "m",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if username is more than 20 character', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikasonparaskaikista",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: 2
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if password is more than 50 character', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas11",
        password: "pa$$word10a$$word10a$$word10a$$word10a$$word100",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: 2
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if password is less than 5 characters', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas12",
        password: "pa$$",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: 2
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if lName, phone and fname <20 and email <50 characters', async function() {
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas13",
        password: "pa$$word",
        lName: "John1234567890123456789",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas14",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 45344551234567890",
        email: "qwerty@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas15",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty1234567890123456789012345678901234567@asdfg.fi",
        fName: "Doe"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/users/register')
      .send({          
        username: "mikkomallikas16",
        password: "pa$$word",
        lName: "John",
        phoneNumber: "040 4534455",
        email: "qwerty@asdfg.fi",
        fName: "Doe1234567890123456789"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
  })


  describe('testing route /login', function() {
    it('Should return status 200 with correct request', async function() {
      await chai.request( apiAddress)
      .post('/login')
      .set('Authorization', 'Basic ' + Buffer.from("mikkomallikas" + ':' + "pa$$word").toString('base64'))
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('token');
        token = response.body.token ;
        console.log(token);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if username is missing', async function() {
      await chai.request( apiAddress)
      .post('/login')
      .set('Authorization', 'Basic ' + Buffer.from(':' + "pa$$word").toString('base64'))
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if password is missing', async function() {
      await chai.request( apiAddress)
      .post('/login')
      .set('Authorization', 'Basic ' + Buffer.from("mikkomallikas" + ':').toString('base64'))
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
    })
    //there isn't currently a validator on the api....

    // it('Should reject request if the datatype is wrong', async function() {
    //   await chai.request( apiAddress)
    //   .post('/login')
    //   .set("Authorization", "basic " + new Buffer("mikkomallikas:pa$$word").toString("base64"))
    //   .then(response => {
    //     expect(response.status).to.equal(400);
    //   })
    //   .catch(error => {
    //     throw error ;
    //   })
    //   await chai.request( apiAddress)
    //   .post('/login')
    //   .send({          
    //     username: "mikkomallikas",
    //     password: 1
    //   })
    //   .then(response => {
    //     expect(response.status).to.equal(400);
    //   })
    //   .catch(error => {
    //     throw error ;
    //   })
    // })
    
    // it('Should reject request if there are additional fields', async function() {
    //   await chai.request( apiAddress)
    //   .post('/login')
    //   .set("Authorization", "basic " + new Buffer("mikkomallikas:pa$$word").toString("base64"))
    //   .then(response => {
    //     expect(response.status).to.equal(400);
    //   })
    //   .catch(error => {
    //     throw error ;
    //   })
    // })
    it('Should reject request if there is no user with the given username', async function() {
      await chai.request( apiAddress)
      .post('/login')
      .set('Authorization', 'Basic ' + Buffer.from("mikkomallikasfff" + ':' + "pa$$word").toString('base64'))
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if the password is wrong', async function() {
      await chai.request( apiAddress)
      .post('/login')
      .set('Authorization', 'Basic ' + Buffer.from("mikkomallikas" + ':' + "pa$$wford").toString('base64'))
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
    })
  })



  describe('testing route /items', function() {
    it('Should return status 200 with correct request', async function() {
      await chai.request( apiAddress)
      .post('/items')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false 
        }
      })
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.jsonSchema(userCreatedSchema);
        itemId = response.body.id ;
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if there are additional fields in body', async function() {
      await chai.request( apiAddress)
      .post('/items')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false 
        },
        extra: "here is my cool extra thingy!"
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if token is wrong or missing', async function() {
      await chai.request( apiAddress)
      .post('/items')
      .set('Authorization', 'Bearer ' + 'mysupercooltoken')
      .send({
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false 
        }
      })
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
      await chai.request( apiAddress)
      .post('/items')
      .set('Authorization', 'Bearer')
      .send({
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false 
        }
      })
      .then(response => {
        expect(response.status).to.equal(401);
      })
      .catch(error => {
        throw error ;
      })
    })


  
  describe('testing route /items/:itemid', function() {
    it('Should return status 200 with correct request', async function() {
      await chai.request( apiAddress)
      .put('/items/' + itemId)
      .set('Authorization', 'Bearer ' + token)
      .send({          
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false
        }
      })
      .then(response => {
        expect(response.status).to.equal(200);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if the id params is wrong', async function() {
      await chai.request( apiAddress)
      .put('/items/' + "123e4567-e89b-12d3-a456-42661417400")
      .set('Authorization', 'Bearer ' + token)
      .send({          
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false
        }
      })
      .then(response => {
        expect(response.status).to.equal(406);
      })
      .catch(error => {
        throw error ;
      })
    })
    it('Should reject request if there are extra inputs', async function() {
      await chai.request( apiAddress)
      .put('/items/' + itemId)
      .set('Authorization', 'Bearer ' + token)
      .send({          
        title: "ps4 controller",
        description: "cool controller, color gold",
        category: "gaming",
        location: {
          zipCode: 92240,
          city: "Lasikangas"
        },
        imageNames: ["controller1.png", "controller2.png"],
        extra: "this is very special extra field that shouldn't be here",
        askingPrice: 10.0,
        deliveryType: {
          shipping: true,
          pickup: false
        }
      })
      .then(response => {
        expect(response.status).to.equal(400);
      })
      .catch(error => {
        throw error ;
      })
    })
  })
  describe('testing route /????', function() {
    it('Should return status 200 with correct request', async function() {})
  })
}) 
})

//for multidatathingy
// it('Should reject request if there are additional fields in body', async function() {
//   await chai.request( apiAddress)
//   .post('/items')
//   .set('Authorization', 'Bearer ' + token)
//   .set('Content-Type', 'application/x-www-form-urlencoded')
//   .field({title: "ps4 controller",
//           description: "cool controller, color gold",
//           category: "gaming",
//           zipCode: 92240,
//           city: "Lasikangas",
//           imageNames: ["controller1.png", "controller2.png"],
//           askingPrice: 10.0,
//           shipping: true,
//           pickup: false,
//           extra: "this is some extra thingy!" })
//   .attach('photos', './test/testimage.png')
//   .attach('photos', './test/testimage2.png')
//   .then(response => {
//     expect(response.status).to.equal(200);
//   })
//   .catch(error => {
//     throw error ;
//   })
// })