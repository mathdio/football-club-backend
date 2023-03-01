import ITeam from './ITeam';

export default interface ITeamsServices {
  findAll(): Promise<ITeam[]>
  findById(id: number): Promise<ITeam | null>
  findOne(id: number): Promise<ITeam | null>
}
