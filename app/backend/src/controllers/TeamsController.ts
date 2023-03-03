import { Request, Response } from 'express';
import ILeaderboardResult from '../interfaces/ILeaderboardResult';
import ITeam from '../interfaces/ITeam';
import IMatch from '../interfaces/IMatch';
// import MatchesService from '../services/MatchesService';
import ITeamsServices from '../interfaces/ITeamsServices';
import IMatchesService from '../interfaces/IMatchesService';

// const matchesService = new MatchesService();

class TeamsController {
  private _teamsService: ITeamsServices;
  private _matchesService: IMatchesService;

  constructor(teamsService: ITeamsServices, matchesService: IMatchesService) {
    this._teamsService = teamsService;
    this._matchesService = matchesService;
  }

  findAll = async (req: Request, res: Response) => {
    const result = await this._teamsService.findAll();
    return res.status(200).json(result);
  };

  findById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this._teamsService.findById(id);
    if (!result) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }

    if (result) return res.status(200).json(result);
  };

  public static totalVictories(id: number, matches: IMatch[]): number {
    const totalVictories = matches
      .reduce((acc, { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals }) => {
        if (homeTeamId === id && homeTeamGoals > awayTeamGoals) {
          return acc + 1;
        }
        if (awayTeamId === id && awayTeamGoals > homeTeamGoals) {
          return acc + 1;
        }
        return acc;
      }, 0);
    return totalVictories;
  }

  public static totalDraws(id: number, matches: IMatch[]): number {
    const totalDraws = matches
      .reduce((acc, { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }) => {
        if (homeTeamId === id && homeTeamGoals === awayTeamGoals) {
          return acc + 1;
        }
        if (awayTeamId === id && awayTeamGoals === homeTeamGoals) {
          return acc + 1;
        }
        return acc;
      }, 0);
    return totalDraws;
  }

  public static totalPoints(id: number, matches: IMatch[]): number {
    const victories = TeamsController.totalVictories(id, matches);
    const draws = TeamsController.totalDraws(id, matches);

    const totalPoints = victories * 3 + draws;
    return totalPoints;
  }

  public static totalGames(id: number, matches: IMatch[]): number {
    const totalGames = matches.reduce((acc, { homeTeamId, awayTeamId }) => {
      if (homeTeamId === id || awayTeamId === id) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return totalGames;
  }

  public static totalLosses(id: number, matches: IMatch[]): number {
    const totalLosses = matches
      .reduce((acc, { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals }) => {
        if (homeTeamId === id && homeTeamGoals < awayTeamGoals) {
          return acc + 1;
        }
        if (awayTeamId === id && awayTeamGoals < homeTeamGoals) {
          return acc + 1;
        }
        return acc;
      }, 0);
    return totalLosses;
  }

  public static goalsFavor(id: number, matches: IMatch[]): number {
    const goalsFavor = matches
      .reduce((acc, { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }) => {
        if (homeTeamId === id) return acc + homeTeamGoals;
        if (awayTeamId === id) return acc + awayTeamGoals;
        return acc;
      }, 0);
    return goalsFavor;
  }

  public static goalsOwn(id: number, matches: IMatch[]): number {
    const goalsOwn = matches
      .reduce((acc, { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals }) => {
        if (homeTeamId === id) return acc + awayTeamGoals;
        if (awayTeamId === id) return acc + homeTeamGoals;
        return acc;
      }, 0);
    return goalsOwn;
  }

  public static goalsBalance(id: number, matches: IMatch[]): number {
    const GF = this.goalsFavor(id, matches);
    const GO = this.goalsOwn(id, matches);

    const goalsBalance = GF - GO;
    return goalsBalance;
  }

  public static efficiency(id: number, matches: IMatch[]): string {
    const TP = this.totalPoints(id, matches);
    const TG = this.totalGames(id, matches);

    const efficiency = ((TP / (TG * 3)) * 100).toFixed(2);
    return efficiency;
  }

  public static calculatePoints(teams: ITeam[], matches: IMatch[]): ILeaderboardResult[] {
    const result = teams.map(({ id, teamName }) => {
      const homeMatches = matches.filter(({ homeTeamId }) => homeTeamId === id);
      return { name: teamName,
        totalPoints: this.totalPoints(id as number, homeMatches),
        totalGames: this.totalGames(id as number, homeMatches),
        totalVictories: this.totalVictories(id as number, homeMatches),
        totalDraws: this.totalDraws(id as number, homeMatches),
        totalLosses: this.totalLosses(id as number, homeMatches),
        goalsFavor: this.goalsFavor(id as number, homeMatches),
        goalsOwn: this.goalsOwn(id as number, homeMatches),
        goalsBalance: this.goalsBalance(id as number, homeMatches),
        efficiency: this.efficiency(id as number, homeMatches),
      };
    });
    return result;
  }

  public static sortResult(result: ILeaderboardResult[]) {
    const sorted = result.sort((a, b) => {
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.totalPoints > b.totalPoints) return -1;
      if (a.totalPoints < b.totalPoints) return 1;
      if (a.goalsBalance > b.goalsBalance) return -1;
      if (a.goalsBalance < b.goalsBalance) return 1;
      if (a.goalsFavor > b.goalsFavor) return -1;
      if (a.goalsFavor < b.goalsFavor) return 1;
      if (a.goalsOwn > b.goalsOwn) return -1;
      if (a.goalsOwn < b.goalsOwn) return 1;
      return 0;
    });
    return sorted;
  }

  leaderboardHome = async (req: Request, res: Response) => {
    const teams = await this._teamsService.findAll();
    const matches = await this._matchesService.findLeaderboard();

    const result = TeamsController.calculatePoints(teams, matches);
    const sorted = TeamsController.sortResult(result);
    console.log(sorted);
    return res.status(200).json(sorted);
  };
}

export default TeamsController;
