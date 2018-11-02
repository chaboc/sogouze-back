import { MatchModel } from '../model/spotify';
import { UserModel } from '../model/user';
import { Matchs } from '../../../common/class';
import { Connection } from '../database/database';
import { getUsersListMatching } from '../service/listMatching.service';


export function getListMatchs(userId: number): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let arrayUser: Array<any> = []
            let arrayMatching: Array<any> = []
            let matchs: Array<any> = []
            let userArray: any;

            await Connection.query('\
            SELECT M."userId", M."matchingId", U."display_name", U."first_name", U."last_name" \
            FROM "matchs" M \
            INNER JOIN "users" U ON U."idUser" = M."userId"::int \
            WHERE M."userId" = :userId AND M."like" = true'
            ,{ 
                replacements: {'userId': userId}, 
                type: Connection.QueryTypes.SELECT
            }).then (function (data) {
                arrayUser = data
            })
            await Connection.query('\
            SELECT M."userId", M."matchingId", U."display_name", U."first_name", U."last_name" \
            FROM "matchs" M \
            INNER JOIN "users" U ON U."idUser" = M."userId"::int \
            WHERE M."matchingId" = :userId AND M."like" = true'
            ,{ 
                replacements: {'userId': userId}, 
                type: Connection.QueryTypes.SELECT
            }).then (function (data) {
                arrayMatching = data
            })

            await arrayUser.forEach(async (user) => {
                await arrayMatching.forEach(matching => {
                    if (user['userId'] === matching['matchingId'] && user['matchingId'] === matching['userId']){
                        UserModel.findAll({ where: { idUser: user['matchingId'] } }).then ( matchedUser => {
                            if(matchedUser.length > 0){
                                user.usersMatched = matchedUser[0].dataValues
                                console.log(user)
                                matchs.push(user);
                                console.log(arrayMatching.length)
                                console.log(matchs.length)
                                if (arrayMatching.length == matchs.length)
                                    resolve(matchs)
                            }
                            else {
                                resolve(null)
                            }
                        })
                    }
                });
            });
            
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export function createMatch(match: Matchs): void {
    try {
        MatchModel.create(match)
    } catch (err) {
        console.log(err)
    }
}

export async function updateMatch(userId: number, matchingId: number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await MatchModel.update({ like: false }, { where: { 'userId': userId, 'matchingId': matchingId } })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
