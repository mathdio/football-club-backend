import { Router } from 'express';
import UsersService from '../services/UsersService';
import UsersController from '../controllers/UsersController';
import auth from '../middlewares/auth';

const usersRoutes = Router();
const usersService = new UsersService();
const usersController = new UsersController(usersService);

usersRoutes.post('/', usersController.validateLogin);
usersRoutes.get('/role', auth.verifyToken, usersController.userRole);

export default usersRoutes;
