import { JsonController, Body, Req, Post } from 'routing-controllers'
import {
    makeResponseMessage,
    SaveUserInternalDTO
} from '@newturn-develop/types-molink'
import { Request } from 'express'
import env from '../../env'
import { CustomHttpError } from '../../Errors/HttpError'
import { UserService } from '../../Services/UserService'

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
}
