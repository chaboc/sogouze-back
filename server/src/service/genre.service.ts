import { GenreModel } from '../model/spotify';
import { Genres } from '../../../common/class';
var Sequelize = require('sequelize');
const Op = Sequelize.Op

export function findGenres(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            GenreModel.findAll({ 
                attributes: ['userId', 'name', 'occurence'],
                where: { userId: userId } 
            }).then(function (data) {
                if (data != null) {
                    data.forEach(genres => {
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

export function findGenresOthers(userId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            let othersGenres: Array<any> = []
            let currentUserId: number
            let oldUserId: number = -1
            let pos = 0
            GenreModel.findAll({ 
                attributes: ['userId', 'name', 'occurence'],
                where: { userId: {
                    [Op.ne]: userId 
                }} 
            }).then(function (data) {
                if (data != null) {
                    data.map(genres => {
                        currentUserId = genres.dataValues.userId
                        if (oldUserId == -1) {
                            othersGenres.push({
                                'genres': [genres.dataValues]
                            })
                        } else {
                            if (oldUserId == currentUserId) {
                                othersGenres[pos].genres.push(genres.dataValues)
                            }
                            else {
                                othersGenres.push({
                                    'genres': [genres.dataValues]
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
