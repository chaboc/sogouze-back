import { MatchModel } from '../model/spotify';
import { Matchs } from '../../../common/class';


export function getListMatchs(userId: number): any {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let arrayMatchings: Array<Matchs> = []
            MatchModel.findAll({
                where:
                {
                    userId: userId,
                    like: true
                },
            }).then(function (data) {
                data.forEach(matchs => {
                    arrayMatchings.push(matchs)
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

// export async function deleteListMatching(userId: Number): Promise<any> {
//     return new Promise<any>(async (resolve, reject) => {
//         try {
//             await ListMatchingModel.destroy({ where: { 'userId': userId } })
//             resolve("ok")
//         } catch (err) {
//             reject(err)
//         }
//     })
// }
