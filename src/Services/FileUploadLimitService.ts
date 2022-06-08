import SynchoronizationService from './SynchoronizationService'
import { ResetDailyUploadLimitInternalDTO } from '@newturn-develop/types-molink'

export class FileUploadLimitService {
    async resetDailyUploadLimit (dto: ResetDailyUploadLimitInternalDTO) {
        const info = await SynchoronizationService.getUserV2(dto.userID)
        const limit = info.getMap('limit')
        limit.set('dailyUploadLimit', limit.get('maxDailyUploadLimit'))
        if (info.destoryable) {
            info.destroy()
        }
    }
}
