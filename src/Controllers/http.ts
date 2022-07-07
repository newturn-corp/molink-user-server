import { JsonController, Get, Put, Authorized, CurrentUser, Body, UploadedFile, UseBefore } from 'routing-controllers'
import {
    GetUserIDDTO,
    makeEmptyResponseMessage,
    makeResponseMessage,
    UpdateUserBiographyDTO,
    User
} from '@newturn-develop/types-molink'
import ProfileService from '../Services/ProfileService'
import { CustomHttpError } from '../Errors/HttpError'
import { BiographyLengthExceededError, UserNotExists } from '../Errors/ProfileError'
import bodyParser from 'body-parser'

@JsonController('')
export class MainController {
    @Get('/health-check')
    async checkServerStatus () {
        return makeEmptyResponseMessage(200)
    }

    @Get('/id')
    @Authorized()
    async getUserID (@CurrentUser() user: User) {
        return makeResponseMessage(200, new GetUserIDDTO(user.id))
    }

    @Put('/biography')
    @Authorized()
    async setUserBiography (@CurrentUser() user: User, @Body() dto: UpdateUserBiographyDTO) {
        try {
            await ProfileService.updateUserBiography(user, dto)
            return makeEmptyResponseMessage(200)
        } catch (err) {
            if (err instanceof UserNotExists) {
                throw new CustomHttpError(404, 0, '사용자가 존재하지 않습니다.')
            } else if (err instanceof BiographyLengthExceededError) {
                throw new CustomHttpError(409, 0, '설명의 길이가 범위를 초과했습니다.')
            } else {
                throw err
            }
        }
    }

    @Put('/profile-image')
    @Authorized()
    @UseBefore(bodyParser.urlencoded({ extended: true }))
    // eslint-disable-next-line no-undef
    async setProfileImage (@CurrentUser() user: User, @UploadedFile('image', { required: false }) image: any) {
        await ProfileService.updateUserProfileImage(user, image)
        return makeEmptyResponseMessage(200)
    }
}

export default MainController
