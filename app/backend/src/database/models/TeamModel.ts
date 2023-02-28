import { Model, INTEGER, STRING } from 'sequelize';
import ITeam from '../../interfaces/ITeam';
import db from '.';

class Team extends Model implements ITeam {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
});

export default Team;
