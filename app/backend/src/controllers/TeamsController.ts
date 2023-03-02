import { Request, Response } from 'express';
import ILeaderboardResult from '../interfaces/ILeaderboardResult';
import ITeam from '../interfaces/ITeam';
import IMatch from '../interfaces/IMatch';
import MatchesService from '../services/MatchesService';
import ITeamsServices from '../interfaces/ITeamsServices';

const matchesService = new MatchesService();

class TeamsController {
  private _service: ITeamsServices;

  constructor(service: ITeamsServices) {
    this._service = service;
  }

  findAll = async (req: Request, res: Response) => {
    const result = await this._service.findAll();
    return res.status(200).json(result);
  };

  findById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this._service.findById(id);
    if (!result) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }

    if (result) return res.status(200).json(result);
  };

  public static victoriesTotalPoints(id: number, matches: IMatch[]): number[] {
    const filtered = matches
      .filter(({ homeTeamId, awayTeamId }) => homeTeamId === id || awayTeamId === id);
    console.log(filtered);
    let totalPoints = 0;
    let totalDraws = 0;
    let totalVictories = 0;
    filtered.forEach(({ victory }) => {
      if (victory === id) {
        totalPoints += 3;
        totalVictories += 1;
      }
      if (victory === 0) {
        totalDraws += 1;
        totalPoints += 1;
      }
    });
    return [totalPoints, totalDraws, totalVictories];
  }

  public static totalGamesEffic(id: number, matches: IMatch[], totalPoints: number):
  [number, string] {
    let totalGames = 0;
    matches.forEach(({ homeTeamId, awayTeamId }) => {
      if (homeTeamId === id || awayTeamId === id) {
        totalGames += 1;
      }
    });
    const efficiency = ((totalPoints / (totalGames * 3)) * 100);
    const fixedEff = efficiency.toFixed(2);
    return [totalGames, fixedEff];
  }

  public static totalLossesCalculation(id: number, matches: IMatch[]): number {
    const filteredAsHome = matches.filter(({ homeTeamId }) => homeTeamId === id);
    const filteredAsAway = matches.filter(({ awayTeamId }) => awayTeamId === id);
    let totalLosses = 0;

    filteredAsHome.forEach(({ victory, awayTeamId }) => {
      if (victory === awayTeamId) {
        totalLosses += 1;
      }
    });
    filteredAsAway.forEach(({ victory, homeTeamId }) => {
      if (victory === homeTeamId) {
        totalLosses += 1;
      }
    });
    return totalLosses;
  }

  public static goalsFavorCalculation(id: number, matches: IMatch[]): number {
    let goalsFavor = 0;
    matches.forEach(({ homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }) => {
      if (homeTeamId === id) {
        goalsFavor += homeTeamGoals;
      }
      if (awayTeamId === id) {
        goalsFavor += awayTeamGoals;
      }
    });
    return goalsFavor;
  }

  public static goalsOwnCalculation(id: number, matches: IMatch[]): number {
    let goalsOwn = 0;
    matches.forEach(({ homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }) => {
      if (homeTeamId === id) {
        goalsOwn += awayTeamGoals;
      }
      if (awayTeamId === id) {
        goalsOwn += homeTeamGoals;
      }
    });
    return goalsOwn;
  }

  public static calculatePoints(teams: ITeam[], matches: IMatch[]): ILeaderboardResult[] {
    const result = teams.map(({ id, teamName }) => {
      const totalPoints = TeamsController.victoriesTotalPoints(id as number, matches);
      const totalGames = TeamsController.totalGamesEffic(id as number, matches, totalPoints[0]);
      const goalsFavor = TeamsController.goalsFavorCalculation(id as number, matches);
      const goalsOwn = TeamsController.goalsOwnCalculation(id as number, matches);

      return { name: teamName,
        totalPoints: totalPoints[0],
        totalGames: totalGames[0],
        totalVictories: totalPoints[2],
        totalDraws: totalPoints[1],
        totalLosses: TeamsController.totalLossesCalculation(id as number, matches),
        goalsFavor,
        goalsOwn,
        goalsBalance: goalsFavor - goalsOwn,
        efficiency: totalGames[1],
      };
    });
    return result;
  }

  public static matchesWithVictories(matches: IMatch[]): IMatch[] {
    const withVictories = matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        return { ...match, victory: match.homeTeamId };
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return { ...match, victory: match.awayTeamId };
      }
      return { ...match, victory: 0 };
    });
    return withVictories;
  }

  leaderboardHome = async (req: Request, res: Response) => {
    const teams = await this._service.findAll();
    const matches = await matchesService.findLeaderboard();
    const matchesWithVictories = TeamsController.matchesWithVictories(matches);

    const result = TeamsController.calculatePoints(teams, matchesWithVictories);
    // console.log(result);
    return res.status(200).json(result);
  };
}

export default TeamsController;
