import {
    JsonController,
    Body,
    Req,
    Post,
    Put,
    UseBefore,
    UploadedFile, Param
} from 'routing-controllers'
import {
    AddUserBlogDTO,
    makeEmptyResponseMessage,
    makeResponseMessage,
    SaveUserInternalDTO
} from '@newturn-develop/types-molink'
import { Request } from 'express'
import env from '../../env'
import { CustomHttpError } from '../../Errors/HttpError'
import { UserService } from '../../Services/UserService'
import bodyParser from 'body-parser'
import ProfileService from '../../Services/ProfileService'
import { UserBlogService } from '../../Services/UserBlogService'

@JsonController('/internal')
export class InternalController {
    @Post('/')
    async saveUser (@Req() req: Request, @Body() dto: SaveUserInternalDTO) {
        const internalAPIKey = req.cookies['internal-api-key']
        if (!internalAPIKey || internalAPIKey !== env.api.internalKey) {
            throw new CustomHttpError(403, 0, '권한이 없습니다.')
        }
        const service = new UserService()
        const responseDTO = await service.saveUser(dto)
        return makeResponseMessage(201, responseDTO)
    }

    @Put('/:id/profile-image')
    @UseBefore(bodyParser.urlencoded({ extended: true }))
    async setProfileImage (@UploadedFile('image', { required: false }) image: Express.Multer.File, @Req() req: Request, @Param('id') idString: string) {
        const internalAPIKey = req.cookies['internal-api-key']
        if (!internalAPIKey || internalAPIKey !== env.api.internalKey) {
            throw new CustomHttpError(403, 0, '권한이 없습니다.')
        }
        await ProfileService.updateUserProfileImageInternal(Number(idString), image)
        return makeEmptyResponseMessage(200)
    }

    @Put('/:id/add-user-blog')
    async addUserBlog (@Req() req: Request, @Param('id') idString: string, @Body() dto: AddUserBlogDTO) {
        const internalAPIKey = req.cookies['internal-api-key']
        if (!internalAPIKey || internalAPIKey !== env.api.internalKey) {
            throw new CustomHttpError(403, 0, '권한이 없습니다.')
        }
        const service = new UserBlogService()
        await service.addUserBlogInternal(Number(idString), dto)
        return makeEmptyResponseMessage(200)
    }
}
