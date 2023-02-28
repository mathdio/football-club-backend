import { Request, Response } from 'express';
import jwt = require('jsonwebtoken');
import IUsersService from '../interfaces/IUsersService';

const { JWT_SECRET } = process.env;

class UsersController {
  private _service: IUsersService;

  constructor(service: IUsersService) {
    this._service = service;
  }

  validateLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const result = await this._service.validateLogin(email, password);
    if (!result) {
      return res.status(404).json({ message: 'E-mail invalid' });
    }
    const payload = {
      email: result.email,
      result: result.id,
    };
    const token = jwt.sign(payload, JWT_SECRET as string);
    return res.status(200).json({ token });
  };
}

export default UsersController;
