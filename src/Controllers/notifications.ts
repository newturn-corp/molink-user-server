import { JsonController, Authorized, Get, CurrentUser, Body, Put, Post } from 'routing-controllers'
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
import NotificationService from '../Services/NotificationService'

@JsonController('/notifications')
export class NotificationController {
    @Get('')
    @Authorized()
    async getNotifications (@CurrentUser() user: User) {
        const arr = await NotificationService.getActiveNotifications(user)
        return makeResponseMessage(200, arr)
    }

    @Put('/viewed-at')
    @Authorized()
    async setNotificationsViewedAt (@CurrentUser() user: User) {
        await NotificationService.setNotificationsViewedAt(user)
        return makeEmptyResponseMessage(200)
    }

    @Put('/checked-at')
    @Authorized()
    async setNotificationsCheckedAt (@CurrentUser() user: User) {
        await NotificationService.setNotificationsCheckedAt(user)
        return makeEmptyResponseMessage(200)
    }
}

export default NotificationController
