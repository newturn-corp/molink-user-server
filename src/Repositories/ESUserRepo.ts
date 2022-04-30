import { OpenSearch } from '@newturn-develop/molink-utils'

class ESUserRepo {
    async setUserBiography (id: string, biography: string) {
        await OpenSearch.update('molink-user', id, { biography })
    }
}
export default new ESUserRepo()
