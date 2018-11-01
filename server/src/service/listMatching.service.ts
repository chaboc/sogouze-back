import { ListMatchingModel } from '../model/spotify';
import { UserModel } from '../model/user';
import { Matching, Matchs } from '../../../common/class';
import { User } from '../../../common/class';


export function getListMatching(userId: number): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let arrayMatchings: Array<Matching> = []
            let user: any;
            ListMatchingModel.findAll({
                where:
                {
                    userId: userId
                },
                limit: 5
            }).then(function (data) {
                if (data.length == 0) 
                    resolve(data);
                data.forEach(matching => {
                    user = getUsersListMatching(parseInt(matching.matchingId)).then ( user => {
                        matching.dataValues.user = user.dataValues
                        arrayMatchings.push(matching)
                        if(data.length == arrayMatchings.length)
                            resolve(arrayMatchings);
                    })
                });    
            })
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}



export function getUsersListMatching(id: number): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            UserModel.findById(id).then(function (user) {
                resolve(user);
            });
            
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export function getUsersListMatchs(data: Array<Matchs>): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let arrayUser: Array<User> = []
            data.forEach(match => {
                UserModel.findById(match.matchingId).then(function (user) {
                    console.log('USER ' + user)
                    arrayUser.push(user);
                    console.log(data.length, arrayUser.length);
                    if (arrayUser.length == data.length)
                        resolve(arrayUser);
                });
            })
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

export function createListMatching(matchs: Array<Matching>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await matchs.forEach(match => {
                ListMatchingModel.create(match)
            });
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}

export async function deleteOneMatching(userId: number, matchingId: number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await ListMatchingModel.destroy({
                where: {
                    'userId': userId,
                    'matchingId': matchingId
                }
            })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}


export async function deleteListMatching(userId: Number): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            await ListMatchingModel.destroy({ where: { 'userId': userId } })
            resolve("ok")
        } catch (err) {
            reject(err)
        }
    })
}
