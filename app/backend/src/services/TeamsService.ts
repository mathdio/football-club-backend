import { ModelStatic } from 'sequelize';
import Team from '../database/models/TeamModel';
import ITeamsServices from '../interfaces/ITeamsServices';

export default class TeamsService implements ITeamsServices {
  protected model: ModelStatic<Team> = Team;

  async findAll(): Promise<Team[]> {
    const teams = await this.model.findAll();
    return teams;
  }
}
