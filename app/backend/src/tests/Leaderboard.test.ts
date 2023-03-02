import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import TeamModel from '../database/models/TeamModel';
import MatchModel from '../database/models/MatchModel';
import { matchesMock, teamsMock } from './Leaderboard.mock';
import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect } = chai;

describe('/login routes tests', function () {
  afterEach(function() {
    sinon.restore();
  });

  it('', async function () {
    sinon.stub(TeamModel, 'findAll').resolves(teamsMock as unknown as Model[]);
    sinon.stub(MatchModel, 'findAll').resolves(matchesMock as unknown as Model[]);


    const response = await chai.request(app).get('/leaderboard/home');
    expect(response.status).to.be.eq(200);
  });
});