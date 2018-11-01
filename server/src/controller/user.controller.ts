import { User } from '../../../common/class';
import { UserModel } from '../model/user';
import { Connection } from '../database/database';
import { spotifyInfos } from '../../configSpotify';

// import * as bodyParser from 'body-parser';
var Express = require('express');
var Parser = require('body-parser');

let routesUsers = Express();
let user: User;


routesUsers.get('/', async function (req, res, err) {
    try {
        Connection.sync().then(function () {
            UserModel.findAll()
                .then(result => {
                    res.send(result)
                })
        })
    }
    catch {
        res.send(err);
    }
})

routesUsers.get('/:params', async function (req, res, err) {
    try {
    UserModel.findById(req.params.params).then(user =>
        res.send({'message': user})
    )}
    catch {
        res.send(err);
    }
})

routesUsers.post('/', async function (req, res, err) {
    user = req.body;
    try {
        Connection.sync().then(function () {
            UserModel.create(user)
                .then(result => res.send(result))
        })
    }
    catch {
        res.send(err);
    }
})

routesUsers.put('/', async function (req, res, err) {
    user = req.body;
    console.log('user' + user);
    try {
        Connection.sync().then(function () {
            UserModel.update(user, { where: { idUser: user.id } })
            .then(result => res.send(result))
            .catch(err => res.send(err))
        })
    }
    catch(err){
        res.send(err);
    }
})

module.exports = routesUsers;