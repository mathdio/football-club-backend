import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersService from '../services/UsersService';
import authMiddleware from '../middlewares/auth';
import UserModel from '../database/models/UserModel';
import jwt = require('jsonwebtoken');

import UsersController from '../controllers/UsersController';

import bcrypt = require('bcryptjs');
const usersService = new UsersService();
const auth = new authMiddleware();

chai.use(chaiHttp);

const { expect } = chai;

describe('/login routes tests', function () {
  afterEach(function() {
    sinon.restore();
  });

  it('tests if it returns the status code 200', async function () {
    const inputMock = {
      email: "admin@admin.com",
      password: "secret_admin",
    }

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(200);
  });

  it('tests if it returns the status code 400', async function () {
    const inputMock = {
      email: 'admin@admin.com',
    }

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(400);
  });

  it('tests if invalid e-mail returns a UNAUTHORIZED error', async function () {
    const inputMock = {
      email: 'invalidemail@admin.com',
      password: 'secret_admin',
    }
    const responseBody = {
      message: 'Invalid email or password',
    }
    sinon.stub(usersService, 'validateLogin').resolves(null);

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(401);
    expect(response.body).to.deep.eq(responseBody);
  });

  it('tests if invalid password returns a UNAUTHORIZED error', async function () {
    const inputMock = {
      email: 'admin@admin.com',
      password: 'invalid-password',
    }
    const responseBody = {
      message: 'Invalid email or password',
    }
    sinon.stub(bcrypt, 'compareSync').returns(false);

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(401);
    expect(response.body).to.deep.eq(responseBody);
  });

  it('tests if a e-mail with invalid format returns a UNAUTHORIZED error', async function () {
    const inputMock = {
      email: 'admin@com',
      password: 'secret_admin',
    }
    const responseBody = {
      message: 'Invalid email or password',
    }

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(401);
    expect(response.body).to.deep.eq(responseBody);
  });

  it('tests if a password with less than 6 characters returns a UNAUTHORIZED error', async function () {
    const inputMock = {
      email: 'admin@admin.com',
      password: '123',
    }
    const responseBody = {
      message: 'Invalid email or password',
    }

    const response = await chai.request(app).post('/login').send(inputMock);
    expect(response.status).to.be.eq(401);
    expect(response.body).to.deep.eq(responseBody);
  });

  it('tests if the route /login/role returns status code 200', async function () {
    sinon.stub(jwt, 'verify').callsFake(() => {
      return Promise.resolve({success: 'Token is valid'});
    });

    const response = await chai.request(app)
      .get('/login/role')
      .set('authorization', 'token');
    
    expect(response.status).to.be.eq(200);
  });

  it('tests if it returns "Token not found" error', async function () {
    const response = await chai.request(app).get('/login/role')
    
    expect(response.status).to.be.eq(401);
    expect(response.body).to.deep.eq({ message: 'Token not found' });
  });

  // it('tests if the route /login/role returns status code 401 with "Invalid token" error', async function () {
  //   sinon.stub(jwt, 'verify').callsFake(() => {
  //     return Promise.resolve({success: false});
  //   });

  //   const response = await chai.request(app)
  //     .get('/login/role')
  //     .set('authorization', 'token');
    
  //   expect(response.status).to.be.eq(401);
  //   expect(response.body).to.deep.eq({ message: 'Token must be a valid token' });
  // });
});