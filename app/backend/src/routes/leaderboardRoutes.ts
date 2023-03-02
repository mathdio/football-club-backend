import { Router } from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';

const leaderboardRoutes = Router();
const teamService = new TeamsService();
const teamsController = new TeamsController(teamService);

leaderboardRoutes.get('/home', teamsController.leaderboardHome);

export default leaderboardRoutes;
