import User from '../Domain/User'
import { BaseRepo } from '@newturn-develop/molink-utils'

class UserRepo extends BaseRepo {
    getActiveUserById (id: number): Promise<User | undefined> {
        const queryString = 'SELECT * FROM USER_TB WHERE id = ? AND is_deleted = 0'
        return this._selectSingular(queryString, [id])
    }

    getActiveUsers (): Promise<User[]> {
        const queryString = 'SELECT * FROM USER_TB WHERE is_deleted = 0'
        return this._selectPlural(queryString, [])
    }

    saveUser (email: string, nickname: string, pwd: string, pwdSalt: string, isAcceptMarketing: boolean): Promise<number> {
        const queryString = 'INSERT INTO USER_TB(email, nickname, pwd, pwd_salt, is_accept_marketing) VALUES(?, ?, ?, ?, ?)'
        return this._insert(queryString, [email, nickname, pwd, pwdSalt, Number(isAcceptMarketing)])
    }
}

export default new UserRepo()
