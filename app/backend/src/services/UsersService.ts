import { ModelStatic } from 'sequelize';
import bcrypt = require('bcryptjs');
import IUser from '../interfaces/IUser';
import IUsersService from '../interfaces/IUsersService';
import UserModel from '../database/models/UserModel';

export default class UsersService implements IUsersService {
  protected model: ModelStatic<UserModel> = UserModel;

  async validateLogin(email: string, password: string): Promise<IUser | null> {
    const user = await this.model.findOne({
      where: { email },
    });

    if (user) {
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) throw err;
      });
    }
    return user;
  }
}
