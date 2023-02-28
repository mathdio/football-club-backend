import { ModelStatic } from 'sequelize';
import ITeam from '../interfaces/ITeam';
import TeamModel from '../database/models/TeamModel';
import ITeamsServices from '../interfaces/ITeamsServices';

export default class TeamsService implements ITeamsServices {
  protected model: ModelStatic<TeamModel> = TeamModel;

  async findAll(): Promise<ITeam[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async findById(id: number): Promise<ITeam | null> {
    const team = await this.model.findByPk(id);
    return team;
  }
}
