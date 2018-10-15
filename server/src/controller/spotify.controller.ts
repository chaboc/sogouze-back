
import { authorizeURL } from '../../configAuthorizeURL';
import { spotifyInfos } from '../../configSpotify';
import { config } from '../../config';
import { Connection } from '../database/database';
import { UserModel } from '../model/user';
import { ArtistModel, TrackModel } from '../model/spotify';
import { User } from '../../../common/class';
import { Tracks } from '../../../common/class';

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
            user.spotifyId = data.body.id;
            Connection.sync().then(function () {
                UserModel.find({
                    where: {
                        display_name: data.body.display_name
                    }
                }).then(res => {
                    if (res != null) {
                        UserModel.update(
                            user, 
                            { where: { display_name: data.body.display_name }}
                        )
                    } else {
                        UserModel.create(user).then( function (result) {
                            spotifyApi.getMyTopArtists({'time_range': 'short_term', 'limit': 5 }).then( function (artists) {
                                artists.body.items.forEach(item => {
                                    ArtistModel.create({
                                        'userId': result.get('idUser'),
                                        'spotifyId': item.id,
                                        'name': item.name
                                    })
                                });
                            })
                            spotifyApi.getMyTopTracks({ 'time_range': 'short_term', 'limit': 25 }).then( function(tracks) {
                                tracks.body.items.forEach(item => {
                                    TrackModel.create({
                                        'userId': result.get('idUser'),
                                        'spotifyId': item.id,
                                        'name': item.name
                                    })
                                });
                            })
                        })
                    }
                });
            });
            res.send({"code": 200, "message": 'ok'});
        });
    } catch(e) {
        console.log(e);
        res.send({"code": 400, "Erreur": e});
    }
});
routesSpotify.use('/get_matching', async function (req, res) {
try {

    let myTracks: Array<Tracks> = [];
    let otherTracks: Array<Tracks> = [];

    Connection.sync().then(function () {
        TrackModel.findAll({
            where: {
                userId: "14"
            }
        }).then( function (tracksMe) {
            console.log(tracksMe);
            myTracks = tracksMe;
            TrackModel.findAll({
                where: {
                    userId: "15"
                }
            }).then( function (tracksothers) {
                console.log(tracksMe);
                otherTracks = tracksothers;
            })
        })
    })
} catch(e) {
    console.log(e);
    res.send({"code": 400, "Erreur": e});
}
});

module.exports = routesSpotify;