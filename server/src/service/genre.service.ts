import { GenreModel } from '../model/spotify';
import { Genres } from '../../../common/class';

export function findGenres(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            GenreModel.findAll({ where: { userId: userId } }).then(function (data) {
                if (data != null) {
                    data.forEach(genres => {
                        console.log('TEST :\n')
                        console.log(genres.dataValues)
                    });
                    resolve(data)
                } else {
                    resolve(null)
                }
            })
        } catch (err) {
            reject(err)
        }
    });
}

export function createGenres(genres: Array<Genres>, currentUser: Number): void {
    try {
        genres.forEach(item => {
            GenreModel.create({
                'userId': currentUser,
                'name': item.name,
                'occurence': item.occurence
            })
        })
    } catch (err) {
        console.log(err)
    }
}

export async function deleteGenres(currentUser: Number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await GenreModel.destroy({ where: { 'userId': currentUser.toString() } })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
