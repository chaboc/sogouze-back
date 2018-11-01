import {Connection} from "../database/database";
var Sequelize = require('sequelize');

export const ListMatchingModel = Connection.define('listMatching', {
    idListMatching: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    matchingId: Sequelize.STRING,
    pourcentage: Sequelize.INTEGER
});

export const MatchModel = Connection.define('matchs', {
    idMatch: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    matchingId: Sequelize.STRING,
    like: Sequelize.BOOLEAN
});

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
    name: Sequelize.STRING,
    occurence: Sequelize.INTEGER
});
