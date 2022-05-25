import { JsonController, Authorized, Get, CurrentUser, Body, Put, Post, Param } from 'routing-controllers'
import User from '../Domain/User'
import FollowService from '../Services/FollowService'
import {
    AcceptFollowRequestDTO, FollowRequestDTO,
    makeEmptyResponseMessage,
    makeResponseMessage,
    RejectFollowRequestDTO
} from '@newturn-develop/types-molink'
import { UserNotExists } from '../Errors/ProfileError'
import { CustomHttpError } from '../Errors/HttpError'
import { AlreadyFollowing, AlreadyFollowRequested } from '../Errors/FollowError'

@JsonController('/follow')
export class FollowController {
    // 내가 팔로우하는 사람들 Map을 가져오는 API
    @Get('/')
    @Authorized()
    async getFollowMap (@CurrentUser() user: User) {
        const dto = await FollowService.getFollowMap(user)
        return makeResponseMessage(200, dto)
    }

    // 나를 팔로우하는 사람들 Map을 가져오는 API
    @Get('/followers')
    @Authorized()
    async getFollowerMap (@CurrentUser() user: User) {
        const dto = await FollowService.getFollowerMap(user)
        return makeResponseMessage(200, dto)
    }

    @Get('/:userId/info')
    async getFollowInfo (@CurrentUser() user: User, @Param('userId') userId: string) {
        const dto = await FollowService.getFollowInfo(user, Number(userId))
        return makeResponseMessage(200, dto)
    }

    @Get('/requests')
    @Authorized()
    async getMyFollowRequestMap (@CurrentUser() user: User) {
        const arr = await FollowService.getMyActiveFollowRequestMap(user)
        return makeResponseMessage(200, arr)
    }

    @Get('/requested-follows')
    @Authorized()
    async getRequestedFollows (@CurrentUser() user: User) {
        const dto = await FollowService.getRequestedFollows(user)
        return makeResponseMessage(200, dto)
    }

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

    @Post('/')
    @Authorized()
    async follow (@CurrentUser() user: User, @Body() dto: FollowRequestDTO) {
        try {
            await FollowService.follow(user, dto)
            return makeEmptyResponseMessage(200)
        } catch (err) {
            if (err instanceof UserNotExists) {
                throw new CustomHttpError(404, 1, '사용자가 존재하지 않습니다.')
            } else if (err instanceof AlreadyFollowing) {
                throw new CustomHttpError(409, 1, '이미 팔로우 중입니다.')
            } else if (err instanceof AlreadyFollowRequested) {
                throw new CustomHttpError(409, 2, '이미 팔로우 요청을 했습니다.')
            } else {
                throw err
            }
        }
    }

    @Put('/requests/viewed_at')
    @Authorized()
    async setFollowRequestsViewedAt (@CurrentUser() user: User) {
        await FollowService.setActiveFollowRequestsViewedAt(user)
        return makeEmptyResponseMessage(200)
    }
}

export default FollowController
