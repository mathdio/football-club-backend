export default interface ILeaderboardResult {
  name: string,
  totalPoints: number,
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string | number;
}
