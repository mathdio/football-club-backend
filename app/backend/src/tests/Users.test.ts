import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel';
import jwt = require('jsonwebtoken');
import UsersService from '../services/UsersService';
import UsersController from '../controllers/UsersController';

chai.use(chaiHttp);

const { expect } = chai;

describe('/users routes tests', function () {
  afterEach(function() {
    sinon.restore();
  });

  it('tests if it returns a token', async function () {
    const outputMock = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Nzc3NjQ0OTh9.KpLVpXue-UbI6N233ZkqOnXVHsEg2BDcNH2JqRmwBwk'
    };
    const inputMock = {
      email: "admin@admin.com",
      password: "secret_admin",
    }
    // sinon.stub(UsersService, 'validateEncryption').returns();
    // sinon.stub(jwt, 'sign').returns(outputMock);

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(200);
    // expect(response.body).to.deep.eq(outputMock);
  });
});