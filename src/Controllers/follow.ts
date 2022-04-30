import { JsonController, Authorized, Get, CurrentUser, Body, Put } from 'routing-controllers'
import User from '../Domain/User'
import FollowService from '../Services/FollowService'
import { AcceptFollowRequestDTO, makeEmptyResponseMessage, RejectFollowRequestDTO } from '@newturn-develop/types-molink'

@JsonController('/follow')
export class FollowController {
    @Put('/requests/reject')
    @Authorized()
    async rejectFollowRequest (@CurrentUser() user: User, @Body() dto: RejectFollowRequestDTO) {
        await FollowService.rejectFollowRequest(user, dto)
        return makeEmptyResponseMessage(200)
    }

    @Put('/requests/accept')
    @Authorized()
    async acceptFollowRequest (@CurrentUser() user: User, @Body() dto: AcceptFollowRequestDTO) {
        await FollowService.acceptFollowRequest(user, dto)
        return makeEmptyResponseMessage(200)
    }
}

export default FollowController
