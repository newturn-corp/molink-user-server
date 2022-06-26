import { AddUserBlogDTO } from '@newturn-develop/types-molink'
import SynchoronizationService from './SynchoronizationService'

export class UserBlogService {
    public addUserBlogInternal (userID: number, dto: AddUserBlogDTO) {
        return this._addUserBlog(userID, dto)
    }

    private async _addUserBlog (userID: number, dto: AddUserBlogDTO) {
        const user = await SynchoronizationService.getUserV2(userID)
        user.transact(() => {
            const blog = user.getArray<number>('blog')
            blog.push([dto.blogID])
        }, 'server')
        if (user.destoryable) {
            user.destroy()
        }
    }
}
