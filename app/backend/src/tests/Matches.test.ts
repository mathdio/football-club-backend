import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import authMiddleware from '../middlewares/auth';
import MatchModel from '../database/models/MatchModel';
import jwt = require('jsonwebtoken');

import bcrypt = require('bcryptjs');
import IMatch from '../interfaces/IMatch';
import { Model } from 'sequelize';
// const usersService = new UsersService();
// const auth = new authMiddleware();

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches routes tests', function () {
  afterEach(function() {
    sinon.restore();
  });

  it('tests if it returns a array of matches successfully', async function () {
    const outputMock = [{
        "id": 1,
        "homeTeamId": 16,
        "homeTeamGoals": 1,
        "awayTeamId": 8,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Grêmio"
        }
      }]
    sinon.stub(MatchModel, 'findAll').resolves(outputMock as unknown as Model[]);

    const response = await chai.request(app).get('/matches');
    expect(response.status).to.be.eq(200);
    expect(response.body).to.deep.eq(outputMock);
  });

  it('tests if it returns a created match successfully', async function () {
    const mock = {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 8,
      "awayTeamGoals": 2,
      "inProgress": true,
    }
    const requestBody = {
      "homeTeamId": 16,
      "awayTeamId": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
    }
    sinon.stub(jwt, 'verify').callsFake(() => {
      return Promise.resolve({success: 'Token is valid'});
    });
    sinon.stub(MatchModel, 'create').resolves(mock as unknown as Model);

    const response = await chai.request(app)
      .post('/matches')
      .set('authorization', 'token')
      .send(requestBody);
    expect(response.status).to.be.eq(201);
    expect(response.body).to.deep.eq(mock);
  });

  it('tests if it returns a successful response of match updated', async function () {
    const requestBody = {
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    }
    sinon.stub(jwt, 'verify').callsFake(() => {
      return Promise.resolve({success: 'Token is valid'});
    });

    const response = await chai.request(app)
      .patch('/matches/1')
      .set('authorization', 'token')
      .send(requestBody);
    expect(response.status).to.be.eq(200);
    expect(response.body).to.deep.eq({ message: `Match 1 updated!` });
  });

  it('tests if it returns a successful response of match finished', async function () {
    sinon.stub(jwt, 'verify').callsFake(() => {
      return Promise.resolve({success: 'Token is valid'});
    });

    const response = await chai.request(app)
      .patch('/matches/1/finish')
      .set('authorization', 'token');
    expect(response.status).to.be.eq(200);
    expect(response.body).to.deep.eq({ message: 'Finished' });
  });
});