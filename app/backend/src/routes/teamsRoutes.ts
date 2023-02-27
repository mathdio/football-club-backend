import { Router } from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';

const teamsRoutes = Router();
const teamService = new TeamsService();
const teamsController = new TeamsController(teamService);

teamsRoutes.get('/', teamsController.findAll);

export default teamsRoutes;
