// SERVICES
import { createUser } from '../service/user.service';
import { createTracks, findRandomTracks } from '../service/track.service';
import { findRandomArtists, creatRandomArtists } from '../service/artist.service';
import { createGenres } from '../service/genre.service';

// CLASS
import { User, Genres } from '../../../common/class';

// FUNCTIONS
import { sortObject } from '../functions/array_duplicate_counter';

import * as utils from "../../config"

var Express = require('express');
var routesUtils = Express();

routesUtils.use('/create_new_user', async function (req, res) {
    try {
        let newUserId: number
        let arrayTracks: Array<any> = []
        let arrayArtists: Array<any> = []
        let arrayFirst_name: Array<string> = utils.user_infos.first_name
        let arrayLast_name: Array<string> = utils.user_infos.last_name
        let arrayGenres: Array<string> = [] = utils.user_infos.genres

        let first_name: string = arrayFirst_name[Math.floor(Math.random() * arrayFirst_name.length)]
        let last_name: string = arrayLast_name[Math.floor(Math.random() * arrayLast_name.length)]
        let genres: Array<Genres> = []

        let user: User = {
            "display_name": first_name + last_name,
            "email": first_name + last_name + "@gmail.fr",
            "first_name": first_name,
            "last_name": last_name,
            "age": Math.round(Math.random() * (80 - 18) + 18),
            "genre": Math.random() >= 0.5,
            "preference": Math.random() >= 0.5,
        }

        newUserId = await createUser(user)
        arrayTracks = await findRandomTracks()
        arrayArtists = await findRandomArtists()
        await createTracks(arrayTracks, newUserId)
        await creatRandomArtists(arrayArtists, newUserId)

        let maxOccurence: number = 85
        let tmpMaxOccurence: number = 85
        for (let i: number = 0; i < 3; i++) {
            if (i == 0) {
                maxOccurence = Math.round(Math.random() * (maxOccurence - 40) + 40)
                tmpMaxOccurence = maxOccurence
            }
            else if (i == 1) {
                maxOccurence = maxOccurence - maxOccurence
                maxOccurence = Math.round(Math.random() * (maxOccurence - 5) + 5)
            } else {
                maxOccurence = 100 - (tmpMaxOccurence + maxOccurence)
            }

            await genres.push({
                "userId": newUserId,
                "name": arrayGenres[Math.floor(Math.random() * arrayGenres.length)],
                "occurence": maxOccurence
            })
        }
        await genres.sort(sortObject("occurence"));
        await createGenres(genres, newUserId)

        res.send({ "code": 200, "message": "ok" })
    } catch (err) {
        console.log(err)
        res.send({ "code": 400, "Erreur": err })
    }
});

module.exports = routesUtils;