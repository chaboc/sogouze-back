
import { authorizeURL } from '../../configAuthorizeURL';
import { spotifyInfos } from '../../configSpotify';
import { config } from '../../config';
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

routesSpotify.use('/get_infos', async function(req, res, err) {
    var code = req.query.code;
    if (req.query.code){
        spotifyApi.authorizationCodeGrant(req.query.code).then(
            function(data) {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
            },
            function(err) {
                console.log('Something went wrong!', err);
            }
        );
        res.redirect(config.url + "spotify/get_user_infos");
    }
    else {
        res.status(400).json({"error": "undefined"}).end();
    }
})

routesSpotify.use('/get_user_infos', async function (req, res) {
    try {
        spotifyApi.getMe().then(function(data) {
            res.send({"code": 200, "data": data.body});
        });
    } catch(e) {
        console.log(e);
        res.send({"code": 400, "Erreur": e});
    }
});

module.exports = routesSpotify;