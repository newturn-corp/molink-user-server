import { Slack } from '@newturn-develop/molink-utils'
import { SaveSupportDTO, User } from '@newturn-develop/types-molink'
import SupportRepo from '../Repositories/SupportRepo'

class SupportService {
    async saveSupport (user: User, dto: SaveSupportDTO) {
        const message = `새로운 고객 의견이 등록되었습니다!\n${user.email}\n${user.nickname}\n${dto.content}`
        await Slack.sendTextMessage(message, 'C02SBD4B3BP')
        await SupportRepo.saveSupport(user.id, dto.content)
    }
}
export default new SupportService()
