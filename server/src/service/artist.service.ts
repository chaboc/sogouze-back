import { ArtistModel } from '../model/spotify';
import { Genres } from '../../../common/class';
import * as functions from '../functions/array_duplicate_counter';

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
            arrayGenres.sort(functions.sortObject('occurence'))
            let genres: Array<Genres> = Object.keys(arrayGenres).slice(0,3).map(key => (arrayGenres[key]));

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
