import { MatchModel } from '../model/spotify';
import { Matchs } from '../../../common/class';
import { getUsersListMatching } from '../service/listMatching.service';


export function getListMatchs(userId: number): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let arrayMatchings: Array<Matchs> = []
            let user: any;
            MatchModel.findAll({
                where:
                {
                    userId: userId,
                    like: true
                },
            }).then(function (data) {
                data.forEach(matchs => {
                    user = getUsersListMatching(parseInt(matchs.matchingId)).then ( user => {
                        matchs.user = user.dataValues
                        arrayMatchings.push(matchs)
                        if(data.length == arrayMatchings.length)
                            resolve(arrayMatchings);
                    })
                });
                resolve(data);
            })
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
