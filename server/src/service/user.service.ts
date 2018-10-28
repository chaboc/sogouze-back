import { UserModel } from '../model/user';
import { User } from '../../../common/class';

export function findUser(username: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            UserModel.find({ where: { display_name: username } }).then(function (data) {
                if (data != null) {
                    resolve(data.get('idUser'))
                } else {
                    resolve(null)
                }
            })
        } catch (err) {
            reject(err)
        }
    });
}

export function createUser(user: User): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            UserModel.create(user).then(function (data) {
                resolve(data.get('idUser'))
            })
        } catch (err) {
            reject(err)
        }
    })
}

export function updateUser(user: User, username: String): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            UserModel.update(
                user,
                { where: { display_name: username } }
            ).then(function (data) {
                resolve(data)
            })
        } catch (err) {
            reject(err)
        }
    })
}