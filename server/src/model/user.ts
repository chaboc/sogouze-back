var Sequelize = require('sequelize');
import { Connection } from '../database/database';
import {TrackModel, ArtistModel, GenreModel} from "./spotify";

export const UserModel = Connection.define('users', {
    idUser: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    spotifyId: Sequelize.STRING,
    display_name: Sequelize.STRING,
    email: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    genre: Sequelize.BOOLEAN,
    preference: Sequelize.BOOLEAN
})