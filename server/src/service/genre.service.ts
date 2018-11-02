import { GenreModel, MatchModel } from '../model/spotify';
import { Genres } from '../../../common/class';
import { Connection } from '../database/database'

export function findGenres(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            let arrayGenres: Array<any> = []
            GenreModel.findAll({
                attributes: ['userId', 'name', 'occurence'],
                where: { userId: userId }
            }).then(function (data) {
                if (data != null) {
                    data.forEach(genre => {
                        arrayGenres.push({
                            "userId": userId,
                            "name": genre.dataValues.name,
                            "occurence": genre.dataValues.occurence
                        })
                    });
                    resolve(arrayGenres)
                } else {
                    resolve(null)
                }
            })
        } catch (err) {
            reject(err)
        }
    });
}

export function findGenresOthers(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            let othersGenres: Array<any> = []
            let currentUserId: number
            let oldUserId: number = -1
            let pos = 0

            // LEFT JOIN "matchs" M ON (M."userId" = :userId AND M."matchingId" != G."userId") \
            // AND (M."userId" IS NOT NULL OR NOT EXISTS (SELECT M."userId" FROM "matchs" MT)) 
            Connection.query('\
            SELECT G."userId", G."name", G."occurence" \
            FROM "genres" G  \
            WHERE G."userId" != :userId \
            ORDER BY G."userId"',
            { 
                replacements: {'userId': userId}, 
                type: Connection.QueryTypes.SELECT
            }).then(function (data) {
                if (data != null) {
                    data.map(genres => {
                        currentUserId = genres.userId
                        if (oldUserId == -1) {
                            othersGenres.push({
                                'genres': [genres]
                            })
                        } else {
                            if (oldUserId == currentUserId) {
                                othersGenres[pos].genres.push(genres)
                            }
                            else {
                                othersGenres.push({
                                    'genres': [genres]
                                })
                                pos++
                            }
                        }
                        oldUserId = currentUserId
                    });
                    resolve(othersGenres)
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
