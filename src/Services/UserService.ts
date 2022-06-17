import crypto from 'crypto'
import { SaveUserInternalDTO, SaveUserResponseInternalDTO } from '@newturn-develop/types-molink'
import UserRepo from '../Repositories/UserRepo'
import * as Y from 'yjs'
import randomColor from 'randomcolor'
import Identicon from 'identicon.js'
import UserInfoRepo from '../Repositories/UserInfoRepo'
import ESUserRepo from '../Repositories/ESUserRepo'

export class UserService {
    public async saveUser (dto: SaveUserInternalDTO) {
        const { email, nickname, pwd, isAcceptMarketing } = dto
        const {
            salt, hash
        } = this._hashPwd(pwd)
        const userID = await UserRepo.saveUser(email, nickname, hash, salt, isAcceptMarketing)

        const userInfo = new Y.Doc()
        const userProfile = userInfo.getMap('profile')
        const userSetting = userInfo.getMap('setting')
        const userEditorSetting = userInfo.getMap('editorSetting')
        const userLimit = userInfo.getMap('limit')
        const userETC = userInfo.getMap('etc')

        const biography = ''
        const color = [...randomColor({
            luminosity: 'light',
            alpha: 1,
            format: 'rgbArray'
        }) as any, 255] as [number, number, number, number]
        const profileImageUrl = `data:image/png;base64,${
            new Identicon(
                crypto.createHash('sha512')
                    .update(nickname)
                    .digest('base64'), {
                    size: 64,
                    foreground: color,
                    background: [250, 250, 250, 255]
                }).toString()}`
        userInfo.transact(() => {
            // setting user profile
            userProfile.set('profileImageUrl', profileImageUrl)
            userProfile.set('biography', biography)
            userProfile.set('nickname', nickname)

            // setting user setting
            userSetting.set('followWithoutApprove', false)
            userSetting.set('showSubDocumentCount', false)
            userSetting.set('hierarchyWidth', 240)

            userEditorSetting.set('toolbarEnable', false)

            userLimit.set('sizeLimitPerUpload', 5242880)
            userLimit.set('maxTotalUploadLimit', 104857600 * 5)
            userLimit.set('totalUploadLimit', 104857600 * 5)
            userLimit.set('maxDailyUploadLimit', 104857600)
            userLimit.set('dailyUploadLimit', 104857600)

            userETC.set('shownTutorial', false)
        })
        await UserInfoRepo.persistUserInfoUpdate(userID, Y.encodeStateAsUpdate(userInfo))
        await ESUserRepo.saveUser(userID, nickname, biography, profileImageUrl)
        return new SaveUserResponseInternalDTO(userID)
    }

    private _hashPwd (pwd: string) {
        const pwdBuf = crypto.randomBytes(64)
        const pwdSalt = pwdBuf.toString('base64')
        const pwdKey = crypto.pbkdf2Sync(pwd, pwdSalt, 100000, 64, 'sha512')
        const hashedPwd = pwdKey.toString('base64')
        return {
            salt: pwdSalt,
            hash: hashedPwd
        }
    }
}
