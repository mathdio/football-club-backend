import { Model, INTEGER } from 'sequelize';
import db from '.';

class Team extends Model {
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
}, {
  sequelize: db,
  underscored: true,
  timestamps: false,
});
