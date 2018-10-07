
import { authorizeURL } from '../../configAuthorizeURL';
import { spotifyInfos } from '../../configSpotify';
import { config } from '../../config';
import { Connection } from '../database/database';
import { UserModel } from '../model/user';
import { User } from '../../../common/class';

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
        let user: User;
        spotifyApi.getMe().then(function(data) {
            user = data.body;
            user.spotiyId = data.body.id;
            Connection.sync().then(function () {
                UserModel.find({
                    where: {
                        display_name: data.body.display_name
                    }
                }).then(res => {
                    if (res == null) {
                        UserModel.create(user)
                    } else {
                        UserModel.update(
                            user, 
                            { where: { display_name: data.body.display_name }}
                        )
                    }
                });
            });
            res.redirect(config.url + "spotify/get_user_top_artists");
        });
    } catch(e) {
        console.log(e);
        res.send({"code": 400, "Erreur": e});
    }
});

routesSpotify.use('/get_user_top_artists', async function (req, res) {
    try {
        spotifyApi.getMyTopArtists({
            'time_range': 'medium_term',
            'limit': 10
        }).then(function(data) {
            let test = data.body.items;
            console.log(test);
            res.send({"code": 200, "message": 'ok'});
        });
    } catch(err) {
        console.log(err);
        res.send({"code": 400, "Erreur": err});
    }
});

module.exports = routesSpotify;