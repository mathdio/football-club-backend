import { Router } from 'express';
import auth from '../middlewares/auth';
import MatchesController from '../controllers/MatchesController';
import MatchesService from '../services/MatchesService';

const matchesRoutes = Router();
const matchesService = new MatchesService();
const matchesController = new MatchesController(matchesService);

matchesRoutes.get('/', matchesController.findAll);
matchesRoutes.post('/', auth.verifyToken, matchesController.createMatch);
matchesRoutes.patch('/:id', auth.verifyToken, matchesController.updateMatch);
matchesRoutes.patch('/:id/finish', auth.verifyToken, matchesController.finishMatch);

export default matchesRoutes;
