import { UpdateUserBiographyDTO, User } from '@newturn-develop/types-molink'
import ESUserRepo from '../Repositories/ESUserRepo'
import SynchronizationService from './SynchoronizationService'
import { BiographyLengthExceededError, UserNotExists } from '../Errors/ProfileError'
import UserInfoRepo from '../Repositories/UserInfoRepo'
import * as Y from 'yjs'
import { S3Manager } from '@newturn-develop/molink-utils'
import env from '../env'
import UserProfileRepo from '../Repositories/UserProfileRepo'

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

        await UserProfileRepo.setUserProfileBiography(dbUser.id, dto.biography)
        await ESUserRepo.setUserBiography(dbUser.id.toString(), dto.biography)
    }

    // @ts-ignore
    async updateUserProfileImage (dbUser: User, image: Express.Multer.File) {
        const url = await S3Manager.uploadImage(env.isProduction ? 'molink-production-profile-image' : 'molink-development-profile-image', `profile-image-${dbUser.id}`, image)

        const { document, isNew } = SynchronizationService.getUser(dbUser.id)
        if (isNew) {
            const user = await UserInfoRepo.getUserInfo(dbUser.id)
            if (!user) {
                throw new UserNotExists()
            }
            Y.applyUpdate(document, Y.encodeStateAsUpdate(user))
        }
        document.transact(() => {
            document.getMap('profile').set('profileImageUrl', url)
        }, 'server')
        if (document.destoryable) {
            document.destroy()
        }

        await UserProfileRepo.setUserProfileImageUrl(dbUser.id, url)
        await ESUserRepo.setUserProfileImageUrl(dbUser.id.toString(), toString())
    }
}
export default new ProfileService()
