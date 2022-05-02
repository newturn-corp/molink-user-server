import { OpenSearch } from '@newturn-develop/molink-utils'

class ESUserRepo {
    async setUserBiography (id: string, biography: string) {
        await OpenSearch.update('molink-user', id, { biography })
    }

    async setUserProfileImageUrl (id: string, profileImageUrl: string) {
        await OpenSearch.update('molink-user', id, { profileImageUrl })
    }
}
export default new ESUserRepo()
