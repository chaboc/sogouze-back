import { TrackModel } from '../model/spotify';

export function createTracks(tracks: Array<any>, currentUser: Number): void {
    try {
        tracks.forEach(item => {
            TrackModel.create({
                'userId': currentUser,
                'spotifyId': item.id,
                'name': item.name
            })
        })
    } catch (err) {
        console.log(err)
    }
}

export async function deleteTracks(currentUser: Number): Promise<any> {
    return new Promise<any>( async(resolve, reject) => {
        try {
            await TrackModel.destroy({where: { 'userId':  currentUser.toString()}})
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
