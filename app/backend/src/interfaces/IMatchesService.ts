import IMatch from './IMatch';

export default interface IMatchesService {
  findAll(): Promise<IMatch[]>
  finishMatch(id: number): Promise<void>
  updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number): Promise<void>
}
