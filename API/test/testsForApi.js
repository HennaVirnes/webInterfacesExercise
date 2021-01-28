const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const apiAddress = "http://localhost:3000";
const userCreatedSchema = require('./schemas/userCreated.json');
