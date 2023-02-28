import IUser from './IUser';

export default interface IUsersService {
  validateLogin(email: string, password: string): Promise<IUser | null>
}
