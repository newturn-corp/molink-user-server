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
}

export default new UserRepo()
