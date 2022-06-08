import { JsonController, Body, Put, Req } from 'routing-controllers'
import {
    makeEmptyResponseMessage,
    ResetDailyUploadLimitInternalDTO
} from '@newturn-develop/types-molink'
import { Request } from 'express'
import env from '../../env'
import { CustomHttpError } from '../../Errors/HttpError'
import { FileUploadLimitService } from '../../Services/FileUploadLimitService'

@JsonController('/internal/file-upload')
export class InternalFileUploadController {
    @Put('/reset-daily-upload-limit')
    async resetDailyUploadLimit (@Req() req: Request, @Body() dto: ResetDailyUploadLimitInternalDTO) {
        const internalAPIKey = req.cookies['internal-api-key']
        if (!internalAPIKey || internalAPIKey !== env.api.internalKey) {
            throw new CustomHttpError(403, 0, '권한이 없습니다.')
        }
        const service = new FileUploadLimitService()
        await service.resetDailyUploadLimit(dto)
        return makeEmptyResponseMessage(200)
    }
}
