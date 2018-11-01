
import { authorizeURL } from '../../configAuthorizeURL';
import { spotifyInfos } from '../../configSpotify';
import { Connection } from '../database/database';
import { config } from '../../config';
import { io } from '../server';

// SERVICES
import { createUser, findUser, updateUser } from '../service/user.service';
import { createTracks, deleteTracks } from '../service/track.service';
import { createArtists, deleteArtists } from '../service/artist.service';
import { createGenres, deleteGenres, findGenres, findGenresOthers } from '../service/genre.service';

// CLASS
import { User, Matching, Genres, Matchs } from '../../../common/class';
import { createListMatching, deleteListMatching, getListMatching, deleteOneMatching,  getUsersListMatchs } from '../service/listMatching.service';
import { sortObject } from '../functions/array_duplicate_counter';
import { createMatch, getListMatchs, updateMatch } from '../service/matchs.service';
import { UserModel } from '../model/user';
import { ListMatchingModel, MatchModel } from '../model/spotify';

var Http = require('http');
var SpotifyWebApi = require('spotify-web-api-node');
var Express = require('express');
var routesSpotify = Express();
// var io = require('socket.io')(Http);


var auth = authorizeURL;

var spotifyApi = new SpotifyWebApi({
    clientId: spotifyInfos.clientId,
    clientSecret: spotifyInfos.clientSecret,
    redirectUri: spotifyInfos.redirectUri
});


routesSpotify.get('/login', async function (req, res, err) {
    try {
        var authorizeURL = await spotifyApi.createAuthorizeURL(auth.scopes, auth.state);
        res.redirect(authorizeURL);
        res.end();
    }
    catch {
        res.send(err);
    }
})
routesSpotify.use('/get_infos', async function (req, res, err) {
    if (req.query.code) {
        await spotifyApi.authorizationCodeGrant(req.query.code).then(function (data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        });
        res.redirect(config.url + "spotify/get_user_infos");
    }
    else {
        res.status(400).json({ "error": "undefined" }).end();
    }
})

routesSpotify.use('/get_user_infos', async function (req, res) {
    try {
        let user: User
        let getUser: any
        let isUserExist: any
        let currentUser: Number
        let genres: any

        await Connection.sync()
        getUser = await spotifyApi.getMe()
        user = getUser.body
        user.spotifyId = getUser.body.id

        isUserExist = await findUser(getUser.body.display_name)
        if (isUserExist != null) {
            currentUser = isUserExist
            await updateUser(user, getUser.body.display_name)
            await deleteArtists(currentUser)
            await deleteTracks(currentUser)
            await deleteGenres(currentUser)
        } else {
            currentUser = await createUser(user)
        }
        await spotifyApi.getMyTopArtists({ 'time_range': 'short_term', 'limit': 10 }).then(async function (data) {
            let artists: Array<any> = data.body.items
            genres = await createArtists(artists, currentUser)
            await createGenres(genres, currentUser)
        })

        spotifyApi.getMyTopTracks({ 'time_range': 'short_term', 'limit': 30 }).then(function (data) {
            let tracks: Array<any> = data.body.items
            createTracks(tracks, currentUser)
        })

        res.send({ "code": 200, "message": 'ok' })
    } catch (e) {
        console.log(e);
        res.send({ "code": 400, "Erreur": e })
    }
});

routesSpotify.use('/get_matching/:id', async function (req, res) {
    try {
        let matching: number = 0
        let arrayMatching: Array<Matching> = []
        let properties: Matching
        let userId: number = req.params.id

        await deleteListMatching(userId)

        let myGenres = await findGenres(userId)
        let othersGenres = await findGenresOthers(userId)

        await othersGenres.map(user => {
            myGenres.map(myGenre => {
                user.genres.map(genre => {
                    if (myGenre.name == genre.name) {
                        myGenre.occurence >= genre.occurence ?
                            matching += genre.occurence : matching += myGenre.occurence;
                    }
                });
            })
            properties = {
                userId: userId,
                matchingId: user.genres[0].userId,
                pourcentage: matching
            }
            arrayMatching.push(properties)
            matching = 0
        })
        createListMatching(arrayMatching);

        res.send({ "code": 200, "message": "ok" })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});

routesSpotify.use('/get_list_matching/:id', async function (req, res) {
    try {
        let data: any;
        let users: any;
        let userId: number = req.params.id
        data = await getListMatching(userId)
        await data.sort(sortObject('pourcentage'))
        res.send({ "code": 200, "data": data })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});


// function pushMe( data ) {
//     registeredSockets[data.socketid].emit( data.action, data.value );
// }

// io.sockets.on('connection', function( socket ) {
//   socket.on('join', function( data ) {
//     registeredSockets[socket.id] = socket;
//     /** ... */
//   });

//   socket.on('disconnect', function() {
//     /** ... */
//   });
// });

routesSpotify.use('/match/:id/:opponentId/:like', async function (req, res) {
    try {
        let match: Matchs = {
            userId: req.params.id,
            matchingId: req.params.opponentId,
            like: req.params.like
        }
        createMatch(match)
        deleteOneMatching(req.params.id, req.params.opponentId)
        MatchModel.findAll({
            where:
            {
                userId: req.params.opponentId,
                matchingId: req.params.id,
                like: true
            },
        }).then(data => {
            if(data.length > 0) {
                UserModel.findAll({ where: { id: [ req.params.id, req.params.opponentId] } }).then (users =>
                    io.emit('match', users)
                )
            }
        })
        res.send({ "code": 200, "message": "ok" })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});

routesSpotify.use('/get_matchs/:id', async function (req, res) {
    try {
        let users: any;
        let userId: number = req.params.id
        let data = await getListMatchs(userId)
        res.send({ "code": 200, "data": data, "users": users })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});

routesSpotify.use('/del_match/:id/:matchingId', async function (req, res) {
    try {
        let userId: number = req.params.id
        let matchingId: number = req.params.matchingId
        let data = await updateMatch(userId, matchingId)
        res.send({ "code": 200, "message": data })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});

module.exports = routesSpotify;