import { BaseRepo } from '@newturn-develop/molink-utils'

class UserProfileRepo extends BaseRepo {
    setUserProfileImageUrl (userId: number, profileImageUrl: string) {
        const queryString = 'UPDATE USER_PROFILE_TB SET profile_image_url = ? WHERE user_id = ?'
        return this._update(queryString, [profileImageUrl, userId])
    }

    setUserProfileBiography (userId: number, biography: string) {
        const queryString = 'UPDATE USER_PROFILE_TB SET biography = ? WHERE user_id = ?'
        return this._update(queryString, [biography, userId])
    }
}

export default new UserProfileRepo()
