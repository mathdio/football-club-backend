import Team from '../database/models/TeamModel';
// import ITeam from './ITeam';

export default interface ITeamsServices {
  findAll(): Promise<Team[]>
  // findById(id: number): Promise<Team>
  // create(team: ITeam): Promise<Team>
}
