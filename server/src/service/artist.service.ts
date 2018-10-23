import { ArtistModel } from '../model/spotify';

export function createArtists(artists: Array<any>, currentUser: Number): void {
    try {
        artists.forEach(item => {
            console.log(item)
            // ArtistModel.create({
            //     'userId': currentUser,
            //     'spotifyId': item.id,
            //     'name': item.name
            // })
        })
    } catch (err) {
        console.log(err)
    }
}

export async function deleteArtists(currentUser: Number): Promise<any> {
    return new Promise<any>( async(resolve, reject) => {
        try {
            await ArtistModel.destroy({where: { 'userId':  currentUser.toString()}})
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
