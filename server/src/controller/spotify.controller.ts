
import { authorizeURL } from '../../configAuthorizeURL';
import { spotifyInfos } from '../../configSpotify';
import { Connection } from '../database/database';
import { config } from '../../config';

// SERVICES
import { createUser, findUser, updateUser } from '../service/user.service';
import { createTracks, deleteTracks } from '../service/track.service';
import { createArtists, deleteArtists } from '../service/artist.service';
import { createGenres, deleteGenres, findGenres } from '../service/genre.service';

// CLASS
import { User } from '../../../common/class';
import { Genres } from '../../../common/class';

var SpotifyWebApi = require('spotify-web-api-node');
var Express = require('express');
var routesSpotify = Express();

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
        await spotifyApi.authorizationCodeGrant(req.query.code).then( function (data) {
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
        let isUserExist: Number
        let currentUser: Number
        let genres: any

        await Connection.sync()
        getUser = await spotifyApi.getMe()
        user = getUser.body
        user.spotifyId = getUser.body.id

        isUserExist = await findUser(user.id)
        console.log('RESULT: ', isUserExist)
        if (isUserExist != null) {
            currentUser = isUserExist
            await updateUser(user, getUser.body.display_name)
            // await deleteArtists(currentUser)
            // await deleteTracks(currentUser)
            // await deleteGenres(currentUser)
            console.log('CURRENT USER: ', currentUser)
        } else {
            currentUser = await createUser(user)
            console.log('CURRENT USER: ', currentUser)
        }
        await spotifyApi.getMyTopArtists({ 'time_range': 'short_term', 'limit': 10 }).then(async function (data) {
            let artists: Array<any> = data.body.items
            // genres = await createArtists(artists, currentUser)
            console.log('genres: ', genres)
            // await createGenres(genres, currentUser)
        })

        spotifyApi.getMyTopTracks({ 'time_range': 'short_term', 'limit': 30 }).then(function (data) {
            let tracks: Array<any> = data.body.items
            // createTracks(tracks, currentUser)
        })

        res.send({ "code": 200, "message": 'ok' });
    } catch (e) {
        console.log(e);
        res.send({ "code": 400, "Erreur": e });
    }
});

routesSpotify.use('/get_matching/:id', async function (req, res) {
    try {
        let userId: number = req.params.id;
        findGenres(userId)
        res.send({ "code": 200, "message": "ok" });
    } catch (e) {
        console.log(e);
        res.send({ "code": 400, "Erreur": e });
    }
});

module.exports = routesSpotify;