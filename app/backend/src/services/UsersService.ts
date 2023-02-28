import { ModelStatic } from 'sequelize';
import bcrypt = require('bcryptjs');
import IUser from '../interfaces/IUser';
import IUsersService from '../interfaces/IUsersService';
import UserModel from '../database/models/UserModel';

export default class UsersService implements IUsersService {
  protected model: ModelStatic<UserModel> = UserModel;

  public static validateEncryption(password: string, user: IUser) {
    const validatePassword = bcrypt.compareSync(password, user.password);
    if (!validatePassword) {
      const error = new Error('Invalid email or password');
      error.name = 'UNAUTHORIZED';
      throw error;
    }
  }

  async validateLogin(email: string, password: string): Promise<IUser | null> {
    const user = await this.model.findOne({
      where: { email },
    });
    if (user) {
      UsersService.validateEncryption(password, user);
    }
    return user;
  }
}
