import * as Sequelize from 'sequelize';
import { verify } from 'jsonwebtoken';

import * as Promise from 'bluebird';
global.Promise = Promise;

import { SequelizeAttributes } from '../types';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IUser {
  id?: number;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  institution?: string;
  updatedAt?: string;
  createdAt?: string;
}

type UserInstance = Sequelize.Instance<IUser> & IUser;

interface UserModel extends Sequelize.Model<UserInstance, IUser> {
  findByToken: (d: string) => Promise<IUser>;
}

const userFactory = (sequalize: Sequelize.Sequelize) => {
  const attributes: SequelizeAttributes<IUser> = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    role: {
      type: Sequelize.ENUM,
      values: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      defaultValue: 'USER',
    },
    firstName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    institution: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  };
  const User = sequalize.define<UserInstance, IUser>(
    'User',
    attributes
  ) as UserModel;
  User.associate = models => {
    User.hasMany(models.TsUpload, {
      foreignKey: 'userId',
      as: 'tsUploads',
    });
  };

  User.findByToken = (token: string): Promise<IUser> => {
    let decoded;

    try {
      decoded = verify(token, process.env.EFLOW_JWT_SECRET) as any;
      return User.find({
        where: { email: decoded.email },
        attributes: ['id', 'email'],
      });
    } catch (error) {
      throw error;
    }
  };
  return User;
};

export { userFactory, UserModel };
