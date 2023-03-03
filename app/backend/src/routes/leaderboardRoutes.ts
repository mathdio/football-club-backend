import { Router } from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';
import MatchesService from '../services/MatchesService';

const leaderboardRoutes = Router();
const teamService = new TeamsService();
const matchesService = new MatchesService();
const teamsController = new TeamsController(teamService, matchesService);

leaderboardRoutes.get('/', teamsController.leaderboard);
leaderboardRoutes.get('/home', teamsController.leaderboardHome);
leaderboardRoutes.get('/away', teamsController.leaderboardAway);

export default leaderboardRoutes;
