import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import MatchesService from '../services/MatchesService';

const matchesRoutes = Router();
const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

matchesRoutes.get('/', matchesController.findAll);

export default matchesRoutes;
