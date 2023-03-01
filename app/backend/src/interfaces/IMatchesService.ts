import IMatch from './IMatch';

export default interface IMatchesService {
  findAll(): Promise<IMatch[]>
  finishMatch(id: number): Promise<void>
}
