import { Request, Response } from 'express';
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

  public static totalPointsSum(id: number, matches: IMatch[]): number[] {
    let totalPoints = 0;
    let totalVictories = 0;
    matches.forEach(({ victory }) => {
      if (victory === id) {
        totalPoints += 3;
        totalVictories += 1;
      }
    });
    return [totalPoints, totalVictories];
  }

  public static totalGamesCalculation(id: number, matches: IMatch[]): number {
    let totalGames = 0;
    matches.forEach(({ homeTeamId, awayTeamId }) => {
      if (homeTeamId === id || awayTeamId === id) {
        totalGames += 1;
      }
    });
    return totalGames;
  }

  public static totalDrawsCalculation(id: number, matches: IMatch[]): number {
    const filtered = matches
      .filter(({ homeTeamId, awayTeamId }) => homeTeamId === id || awayTeamId === id);

    let totalDraws = 0;
    filtered.forEach(({ victory }) => {
      if (victory === 0) {
        totalDraws += 1;
      }
    });
    return totalDraws;
  }

  public static totalLossesSum(id: number, matches: IMatch[]): number {
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

  public static calculatePoints(teams: ITeam[], matchesWithVictories: IMatch[]) {
    const result = teams.map(({ id, teamName }) => {
      const totalPoints = TeamsController.totalPointsSum(id as number, matchesWithVictories);
      const totalGames = TeamsController.totalGamesCalculation(id as number, matchesWithVictories);
      const totalDraws = TeamsController.totalDrawsCalculation(id as number, matchesWithVictories);
      const totalLosses = TeamsController.totalLossesSum(id as number, matchesWithVictories);
      const goalsFavor = TeamsController.goalsFavorCalculation(id as number, matchesWithVictories);
      const goalsOwn = TeamsController.goalsOwnCalculation(id as number, matchesWithVictories);

      return { name: teamName,
        totalPoints: totalPoints[0],
        totalGames,
        totalVictories: totalPoints[1],
        totalDraws,
        totalLosses,
        goalsFavor,
        goalsOwn };
    });
    return result;
  }

  leaderboardHome = async (req: Request, res: Response) => {
    const teams = await this._service.findAll();
    const matches = await matchesService.findAll();
    const matchesWithVictories = matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        return { ...match, victory: match.homeTeamId };
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return { ...match, victory: match.awayTeamId };
      }
      return { ...match, victory: 0 };
    });

    const result = TeamsController.calculatePoints(teams, matchesWithVictories);
    return res.status(200).json(result);
  };
}

export default TeamsController;
