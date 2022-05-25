import { BaseRepo } from '@newturn-develop/molink-utils'
import { Follow } from '@newturn-develop/types-molink'

class FollowRepo extends BaseRepo {
    getUserFollows (userId: number): Promise<Follow[]> {
        const queryString = 'SELECT * FROM FOLLOW_TB WHERE following_user_id = ?'
        return this._selectPlural(queryString, [userId])
    }

    getUserFollowers (userId: number): Promise<Follow[]> {
        const queryString = 'SELECT * FROM FOLLOW_TB WHERE user_id = ?'
        return this._selectPlural(queryString, [userId])
    }

    getUserFollowCount (userId: number): Promise<{ count: number }> {
        const queryString = 'SELECT COUNT(*) as count FROM FOLLOW_TB WHERE user_id = ?'
        return this._selectSingular(queryString, [userId])
    }

    getUserFollowingCount (userId: number): Promise<{ count: number }> {
        const queryString = 'SELECT COUNT(*) as count FROM FOLLOW_TB WHERE following_user_id = ?'
        return this._selectSingular(queryString, [userId])
    }

    saveFollow (userId: number, followerId: number) {
        const queryString = 'INSERT INTO FOLLOW_TB(user_id, following_user_id) VALUES(?, ?)'
        return this._insert(queryString, [userId, followerId])
    }

    checkFollowByUserIdAndFollowerId (userId: number, followerId: number): Promise<Follow[]> {
        const queryString = 'SELECT * FROM FOLLOW_TB WHERE user_id = ? AND following_user_id = ?'
        return this._check(queryString, [userId, followerId])
    }
}

export default new FollowRepo()
