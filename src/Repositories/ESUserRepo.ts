import { OpenSearch } from '@newturn-develop/molink-utils'
import { ESUser } from '@newturn-develop/types-molink'

class ESUserRepo {
    rawSourceToUser (id: string, source: any) {
        return new ESUser(id, source.biography, source.nickname, source.profileImageUrl)
    }

    async setUserBiography (id: string, biography: string) {
        await OpenSearch.update('molink-user', id, { biography })
    }

    async setUserProfileImageUrl (id: string, profileImageUrl: string) {
        await OpenSearch.update('molink-user', id, { profileImageUrl })
    }

    async getUserInfoListByIdList (idList: number[]) {
        const rawDocuments = await OpenSearch.select('molink-user', {
            query: {
                ids: {
                    values: idList.map(id => id.toString())
                }
            }
        })
        return rawDocuments.map((raw: any) => {
            const { _id: id, _source: source } = raw
            return this.rawSourceToUser(id, source)
        }) as ESUser[]
    }

    private async _saveUser (userId: number, obj: any) {
        const id = await OpenSearch.insert('molink-user', 'user', obj, userId.toString()) as string
        return id
    }

    public saveUser (userId: number, nickname: string, biography: string, profileImageUrl: string) {
        return this._saveUser(userId, {
            nickname,
            biography,
            profileImageUrl
        })
    }
}
export default new ESUserRepo()
