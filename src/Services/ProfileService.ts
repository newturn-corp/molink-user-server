import { UpdateUserBiographyDTO, User } from '@newturn-develop/types-molink'
import ESUserRepo from '../Repositories/ESUserRepo'
import SynchronizationService from './SynchoronizationService'
import { BiographyLengthExceededError, UserNotExists } from '../Errors/ProfileError'
import UserInfoRepo from '../Repositories/UserInfoRepo'
import * as Y from 'yjs'

class ProfileService {
    async updateUserBiography (dbUser: User, dto: UpdateUserBiographyDTO) {
        if (dto.biography.length > 100) {
            throw new BiographyLengthExceededError()
        }
        const { document, isNew } = SynchronizationService.getUser(dbUser.id)
        if (isNew) {
            const user = await UserInfoRepo.getUserInfo(dbUser.id)
            if (!user) {
                throw new UserNotExists()
            }
            Y.applyUpdate(document, Y.encodeStateAsUpdate(user))
        }
        document.transact(() => {
            document.getMap('profile').set('biography', dto.biography)
        }, 'server')
        if (document.destoryable) {
            document.destroy()
        }
        await ESUserRepo.setUserBiography(dbUser.id.toString(), dto.biography)
    }
}
export default new ProfileService()
