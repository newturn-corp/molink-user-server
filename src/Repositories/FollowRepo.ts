import { BaseRepo } from '@newturn-develop/molink-utils'

class FollowRepo extends BaseRepo {
    saveFollow (userId: number, followerId: number) {
        const queryString = 'INSERT INTO FOLLOW_TB(user_id, following_user_id) VALUES(?, ?)'
        return this._insert(queryString, [userId, followerId])
    }
}

export default new FollowRepo()
