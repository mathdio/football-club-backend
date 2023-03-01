import { ModelStatic } from 'sequelize';
import IMatchesService from '../interfaces/IMatchesService';
import MatchModel from '../database/models/MatchModel';
import IMatch from '../interfaces/IMatch';
import TeamModel from '../database/models/TeamModel';

export default class MatchesService implements IMatchesService {
  protected model: ModelStatic<MatchModel> = MatchModel;

  async findAll(): Promise<IMatch[]> {
    const matches = await this.model.findAll({
      include: [
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matches;
  }

  async finishMatch(id: number): Promise<void> {
    await this.model.update(
      { inProgress: false },
      { where: { id } },
    );
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number): Promise<void> {
    await this.model.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }

  async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<IMatch> {
    const match = await this.model.create(
      { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: true },
    );

    return {
      id: match.id,
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    };
  }
}
