import { BaseRepo } from '@newturn-develop/molink-utils'
import { FollowRequest } from '@newturn-develop/types-molink'

class FollowRequestRepo extends BaseRepo {
    saveFollowRequest (userId: number, followerId: number) {
        const queryString = 'INSERT INTO FOLLOW_REQUEST_TB(user_id, follower_id) VALUES(?, ?)'
        return this._insert(queryString, [userId, followerId])
    }

    checkFollowRequestByUserIdAndFollowerId (userId: number, followerId: number): Promise<FollowRequest[]> {
        const queryString = 'SELECT * FROM FOLLOW_REQUEST_TB WHERE user_id = ? AND follower_id = ?'
        return this._check(queryString, [userId, followerId])
    }

    getFollowerActiveFollowRequests (followerId: number): Promise<FollowRequest[]> {
        const queryString = 'SELECT * FROM FOLLOW_REQUEST_TB WHERE follower_id = ? AND rejected_at IS NULL AND accepted_at IS NULL'
        return this._selectPlural(queryString, [followerId])
    }

    getUserActiveFollowRequests (userId: number): Promise<FollowRequest[]> {
        const queryString = 'SELECT * FROM FOLLOW_REQUEST_TB WHERE user_id = ? AND rejected_at IS NULL AND accepted_at IS NULL'
        return this._selectPlural(queryString, [userId])
    }

    getFollowRequest (id: number): Promise<FollowRequest> {
        const queryString = 'SELECT * FROM FOLLOW_REQUEST_TB WHERE id = ?'
        return this._selectSingular(queryString, [id])
    }

    setFollowRequestRejected (id: number) {
        const queryString = 'UPDATE FOLLOW_REQUEST_TB SET rejected_at = ? WHERE id = ?'
        return this._update(queryString, [new Date(), id])
    }

    setFollowRequestAccepted (id: number) {
        const queryString = 'UPDATE FOLLOW_REQUEST_TB SET accepted_at = ? WHERE id = ?'
        return this._update(queryString, [new Date(), id])
    }

    setActiveFollowRequestsViewedAt (userId: number) {
        const queryString = 'UPDATE FOLLOW_REQUEST_TB SET viewed_at = ? WHERE user_id = ? AND rejected_at IS NULL AND accepted_at IS NULL AND viewed_at IS NULL'
        return this._selectPlural(queryString, [new Date(), userId])
    }
}

export default new FollowRequestRepo()
