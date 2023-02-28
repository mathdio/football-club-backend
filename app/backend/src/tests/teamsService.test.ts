import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { Response } from 'superagent';

chai.use(chaiHttp);
const { expect } = chai;

// import TeamsService from '../services/TeamsService';
// import { Model } from 'sequelize';
import ITeam from '../interfaces/ITeam';

// const teamsService = new TeamsService();

describe('/teams routes service tests', function() {
  afterEach(function() {
    sinon.restore();
  });

  it('tests if it returns all posts', async function() {
    const outputMock: ITeam[] = [
      new TeamModel({ id: 1, teamName: 'Avaí/Kindermann' }),
      new TeamModel({ id: 2, teamName: 'Bahia' }),
    ];

    sinon.stub(TeamModel, 'findAll').resolves(outputMock as TeamModel[]);

    const response = await chai.request(app).get('/teams');
    expect(response.status).to.equal(200);
    expect(response.body).to.equal(outputMock);
    // const result = await teamsService.findAll();
    // expect(result).to.deep.equal(outputMock);
    // expect(result.length).to.be.equal(2);

  });
})