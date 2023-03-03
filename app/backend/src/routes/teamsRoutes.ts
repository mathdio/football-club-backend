import { Router } from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';
import MatchesService from '../services/MatchesService';

const teamsRoutes = Router();
const teamService = new TeamsService();
const matchesService = new MatchesService();
const teamsController = new TeamsController(teamService, matchesService);

teamsRoutes.get('/', teamsController.findAll);
teamsRoutes.get('/:id', teamsController.findById);

export default teamsRoutes;
