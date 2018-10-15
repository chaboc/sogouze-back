import {Connection} from "../database/database";
import {UserModel} from "./user";
var Sequelize = require('sequelize');

export const TrackModel = Connection.define('tracks', {
    idTrack: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    spotifyId: Sequelize.STRING,
    name: Sequelize.STRING,
});


export const ArtistModel = Connection.define('artists', {
    idArtist: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    spotifyId: Sequelize.STRING,
    name: Sequelize.STRING,
});

export const GenreModel = Connection.define('genres', {
    idGenre: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    spotifyId: Sequelize.STRING,
    name: Sequelize.STRING,
});


// TrackModel.hasMany(UserModel, {foreignKey: 'userId', targetKey: 'id'});
// ArtistModel.hasMany(UserModel, {foreignKey: 'userId', targetKey: 'id'});
// GenreModel.hasMany(UserModel, {foreignKey: 'userId', targetKey: 'id'});