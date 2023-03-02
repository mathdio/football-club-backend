import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import ITeam from '../interfaces/ITeam';

chai.use(chaiHttp);
const { expect } = chai;

describe('/teams routes tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  it('tests if it returns all teams', async function() {
    const outputMock: ITeam[] = [
      { id: 1, teamName: 'Avaí/Kindermann' },
      { id: 2, teamName: 'Bahia' },
    ];
    sinon.stub(TeamModel, 'findAll').resolves(outputMock as TeamModel[]);

    const response = await chai.request(app).get('/teams');
    expect(response.status).to.be.eq(200);
    expect(response.body).to.deep.eq(outputMock);
  });

  it('tests if it returns a team successfully', async function() {
    const outputMock: ITeam = {
      id: 1,
      teamName: 'Avaí/Kindermann',
    };
    sinon.stub(TeamModel, 'findByPk').resolves(outputMock as TeamModel);

    const response = await chai.request(app).get('/teams/1');
    expect(response.status).to.be.eq(200);
    expect(response.body).to.deep.eq(outputMock);
  });

  it('tests if it returns a BAD_REQUEST error', async function() {
    const outputMock = { message: 'Team not found' };
    sinon.stub(TeamModel, 'findByPk').resolves(null);

    const response = await chai.request(app).get('/teams/999');
    expect(response.status).to.be.eq(404);
    expect(response.body).to.deep.eq(outputMock);
  });
})