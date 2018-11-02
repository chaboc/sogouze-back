import { ArtistModel } from '../model/spotify';
import { Genres, Artists } from '../../../common/class';
import * as functions from '../functions/array_duplicate_counter';
import { Connection } from '../database/database';
import { reject } from 'bluebird';

export async function findRandomArtists(): Promise<any> {
    try {
        return new Promise<any>(async (resolve, reject) => {
            let arrayTracks: Array<Artists> = []
            await Connection.query(' \
            SELECT * FROM ( \
                SELECT DISTINCT t."name", t."spotifyId" from "artists" t \
            ) tr ORDER BY RANDOM() LIMIT 10'
            ,{
                type: Connection.QueryTypes.SELECT  
            }).then(async function (data) {
                resolve(data)
            })
        })
    } catch (err) {
        reject(err)
        console.log(err)
    }
}

export async function creatRandomArtists(artists: Array<Artists>, currentUser): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            artists.forEach(item => {
                ArtistModel.create({
                    'userId': currentUser,
                    'spotifyId': item.spotifyId,
                    'name': item.name
                })
            })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

export async function createArtists(artists: Array<any>, currentUser: Number): Promise<any> {
    let arrayArtists: Array<string> = []
    let arrayGenres: Array<any> = []

    return new Promise<any>(async (resolve, reject) => {
        try {
            artists.forEach(item => {
                item.genres.forEach(genre => {
                    arrayArtists.push(genre)
                });

                ArtistModel.create({
                    'userId': currentUser,
                    'spotifyId': item.id,
                    'name': item.name
                })
            })

            arrayGenres = functions.compressArray(arrayArtists)
            arrayGenres.sort(functions.sortObject("occurence"))
            let genres: Array<Genres> = Object.keys(arrayGenres).slice(0,3).map(key => (arrayGenres[key]));
            let totalGenre: number = 0;

            Object.keys(genres).map(function(key) {
                totalGenre = totalGenre + genres[key].occurence;
             });
             Object.keys(genres).map(function(key) {
                genres[key].occurence = Math.round(genres[key].occurence / totalGenre * 100);
             });

            resolve(genres)
        } catch (err) {
            reject(err)
        }
    })
}

export async function deleteArtists(currentUser: Number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await ArtistModel.destroy({ where: { 'userId': currentUser.toString() } })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
