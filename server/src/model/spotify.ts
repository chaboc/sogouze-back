import {Connection} from "../database/database";
import {UserModel} from "./user";
var Sequelize = require('sequelize');

export const UserSpotify = Connection.define('user_spotify', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    top_track: Sequelize.INTEGER,
    top_artist: Sequelize.INTEGER,
    top_genre: Sequelize.INTEGER,
});

export const Track = Connection.define('track', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_spotify: Sequelize.STRING,
    name: Sequelize.STRING,
});

export const Genre = Connection.define('genre', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_spotify: Sequelize.STRING,
    name: Sequelize.STRING,
});

export const Artist = Connection.define('artist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_spotify: Sequelize.STRING,
    name: Sequelize.STRING,
});

UserSpotify.belongsTo(UserModel);
UserSpotify.hasMany(Track, {foreignKey: 'top_track', sourceKey: 'id'});
UserSpotify.hasMany(Artist, {foreignKey: 'top_artist', sourceKey: 'id'});
UserSpotify.hasMany(Track, {foreignKey: 'top_genre', sourceKey: 'id'});