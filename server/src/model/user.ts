var Sequelize = require('sequelize');
import { Connection } from '../database/database';

export const UserModel = Connection.define('users', {
    idUser: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    prenom: Sequelize.STRING,
    nom: Sequelize.STRING,
    age: Sequelize.INTEGER,
})