import { JsonController, Authorized, Get, CurrentUser, Req } from 'routing-controllers'
import User from '../Domain/User'
import { FollowService } from '../Services/FollowService'
import {
    makeResponseMessage
} from '@newturn-develop/types-molink'
import Request from 'express'
import { ViewerAPI } from '../API/ViewerAPI'

@JsonController('/follow')
export class FollowController {
    @Get('/')
    @Authorized()
    async getFollowMap (@CurrentUser() user: User, @Req() req: Request) {
        const service = new FollowService(new ViewerAPI(req))
        const dto = await service.getFollowMap(user)
        return makeResponseMessage(200, dto)
    }

    @Get('/requests')
    @Authorized()
    async getMyFollowRequestMap (@CurrentUser() user: User, @Req() req: Request) {
        const service = new FollowService(new ViewerAPI(req))
        const arr = await service.getMyActiveFollowRequestMap(user)
        return makeResponseMessage(200, arr)
    }
}

export default FollowController
