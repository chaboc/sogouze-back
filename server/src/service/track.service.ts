import { TrackModel } from '../model/spotify';
import { Tracks } from '../../../common/class';
import { reject } from 'bluebird';
import { Connection } from '../database/database';

export async function findRandomTracks(): Promise<any> {
    try {
        return new Promise<any>(async (resolve, reject) => {
            let arrayTracks: Array<Tracks> = []
            await Connection.query(' \
            SELECT * FROM ( \
                SELECT DISTINCT t."name", t."spotifyId" from "tracks" t \
            ) tr ORDER BY RANDOM() LIMIT 30'
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

export function createTracks(tracks: Array<any>, currentUser: Number): void {
    try {
        tracks.forEach(item => {
            TrackModel.create({
                'userId': currentUser,
                'spotifyId': item.spotifyId,
                'name': item.name
            })
        })
    } catch (err) {
        console.log(err)
    }
}

export async function deleteTracks(currentUser: Number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await TrackModel.destroy({ where: { 'userId': currentUser.toString() } })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
