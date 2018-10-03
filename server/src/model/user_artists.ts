var Sequelize = require('sequelize');
import { Connection } from '../database/database';

export const UserArtistsModel = Connection.define('users_artists', {
    idUserArtist: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    display_name_user: Sequelize.STRING,
    artist: Sequelize.STRING,
    titre: Sequelize.STRING,
    creation: Sequelize.DATE,
    genre: Sequelize.STRING,
})