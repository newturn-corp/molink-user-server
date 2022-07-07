import { BaseRepo } from '@newturn-develop/molink-utils'

class SupportRepo extends BaseRepo {
    saveSupport (userId: number, content: string): Promise<number> {
        const queryString = 'INSERT INTO SUPPORT_TB(user_id, content) VALUES(?, ?)'
        return this._insert(queryString, [userId, content])
    }
}

export default new SupportRepo()
