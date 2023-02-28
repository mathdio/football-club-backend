import { Router } from 'express';
import UsersService from '../services/UsersService';
import UsersController from '../controllers/UsersController';

const usersRoutes = Router();
const usersService = new UsersService();
const usersController = new UsersController(usersService);

usersRoutes.post('/', usersController.validateLogin);

export default usersRoutes;
