import { Request, Response } from 'express';
import jwt = require('jsonwebtoken');
import IUsersService from '../interfaces/IUsersService';

const { JWT_SECRET } = process.env;
const INVALID_EMAIL_PASSWORD = 'Invalid email or password';

class UsersController {
  private _service: IUsersService;

  constructor(service: IUsersService) {
    this._service = service;
  }

  public static validateEmail(email: string) {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    if (!emailRegex.test(email)) {
      const error = new Error(INVALID_EMAIL_PASSWORD);
      error.name = 'UNAUTHORIZED';
      throw error;
    }
  }

  public static validatePassword(password: string) {
    if (password.length < 6) {
      const error = new Error(INVALID_EMAIL_PASSWORD);
      error.name = 'UNAUTHORIZED';
      throw error;
    }
  }

  validateLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    UsersController.validateEmail(email);
    UsersController.validatePassword(password);

    const result = await this._service.validateLogin(email, password);
    if (!result) {
      const error = new Error(INVALID_EMAIL_PASSWORD);
      error.name = 'UNAUTHORIZED';
      throw error;
    }
    const payload = {
      role: result.role,
    };
    const token = jwt.sign(payload, JWT_SECRET as string);
    return res.status(200).json({ token });
  };

  userRole = async (req: Request, res: Response) => {
    const { role } = req.body;
    return res.status(200).json(role);
  };
}

export default UsersController;
