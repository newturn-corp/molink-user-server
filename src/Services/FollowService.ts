// import { GetFollowRequestResponseDTO, RejectFollowRequestDTO } from '../Dtos/FollowDTO'
// import { FollowResponseDTO, UserWithProfileDTO } from '../Dtos/UserDTO'
// import { UserNotExists } from '../Errors/AuthError'
// import { AlreadyHandledRequest, FollowRequestNotExists, NotYourFollowRequest } from '../Errors/FollowError'
// import { AlreadyFollowing, AlreadyFollowRequested } from '../Errors/UserError'
// import FollowRepo from '../repo/FollowRepo'
// import FollowRequestRepo from '../repo/FollowRequestRepo'
// import NotificationRepo from '../repo/NotificationRepo'
// import { AcceptFollowRequestDTO } from '@newturn-develop/types-molink'

import {
    AcceptFollowRequestDTO, FollowRequestDTO,
    GetFollowMapResponseDTO, GetMyFollowRequestResponseDTO,
    RejectFollowRequestDTO,
    User
} from '@newturn-develop/types-molink'
import SynchronizationService from './SynchoronizationService'
import UserInfoRepo from '../Repositories/UserInfoRepo'
import { UserNotExists } from '../Errors/ProfileError'
import * as Y from 'yjs'
import { AlreadyFollowing, AlreadyFollowRequested } from '../Errors/FollowError'
import moment from 'moment-timezone'
import FollowRepo from '../Repositories/FollowRepo'
import FollowRequestRepo from '../Repositories/FollowRequestRepo'
import UserRepo from '../Repositories/UserRepo'

export enum FollowResult {
    Succeeded = 'succeeded',
    Requested = 'requested'
}

class FollowService {
    async getFollowMap (user: User) {
        const followMap: any = {}
        const follows = await FollowRepo.getUserFollows(user.id)
        for (const follow of follows) {
            followMap[follow.user_id] = true
        }
        return new GetFollowMapResponseDTO(followMap)
    }

    // 내가 요청 중인 팔로우들을 가져오는 API
    async getMyActiveFollowRequestMap (user: User) {
        const followRequestMap: any = {}
        const followRequests = await FollowRequestRepo.getFollowerActiveFollowRequests(user.id)
        for (const followRequest of followRequests) {
            followRequestMap[followRequest.user_id] = true
        }
        return new GetMyFollowRequestResponseDTO(followRequestMap)
    }

    async rejectFollowRequest (user: User, dto: RejectFollowRequestDTO) {
        // const request = await FollowRequestRepo.getFollowRequest(dto.followRequestId)
        // if (!request) {
        //     throw new FollowRequestNotExists()
        // }
        // if (request.user_id !== user.id) {
        //     throw new NotYourFollowRequest()
        // }
        // if (request.accepted_at || request.rejected_at) {
        //     throw new AlreadyHandledRequest()
        // }
        // await FollowRequestRepo.setFollowRequestRejected(request.id)
    }

    async acceptFollowRequest (user: User, dto: AcceptFollowRequestDTO) {
        // const request = await FollowRequestRepo.getFollowRequest(dto.followRequestId)
        // if (!request) {
        //     throw new FollowRequestNotExists()
        // }
        // if (request.user_id !== user.id) {
        //     throw new NotYourFollowRequest()
        // }
        // if (request.accepted_at || request.rejected_at) {
        //     throw new AlreadyHandledRequest()
        // }
        // await FollowRequestRepo.setFollowRequestAccepted(request.id)
        // await FollowRepo.saveFollow(user.id, request.follower_id)
        // await NotificationRepo.saveFollowAcceptionNotification(user.id, request.follower_id)
    }

    async follow (dbUser: User, dto: FollowRequestDTO) {
        const { targetId } = dto
        const targetUser = await UserRepo.getActiveUserById(targetId)
        if (!targetUser) {
            throw new UserNotExists()
        }
        const isAlreadyFollowing = await FollowRepo.checkFollowByUserIdAndFollowerId(targetId, dbUser.id)
        if (isAlreadyFollowing) {
            throw new AlreadyFollowing()
        }
        const isAlreadyFollowRequested = await FollowRequestRepo.checkFollowRequestByUserIdAndFollowerId(targetId, dbUser.id)
        if (isAlreadyFollowRequested) {
            throw new AlreadyFollowRequested()
        }

        await FollowRequestRepo.saveFollowRequest(targetId, dbUser.id)
        // const targetUserSetting = await UserSettingRepo.getUserSetting(targetId)
        // if (targetUserSetting.follow_without_approve) {
        //     await FollowRepo.saveFollow(targetId, user.id)
        //     await NotificationRepo.saveNewFollowNotification(targetId, user.id)
        //     return new FollowResponseDTO(FollowResult.Succeeded)
        // } else {
        //     await FollowRequestRepo.saveFollowRequest(targetId, user.id)
        //     return new FollowResponseDTO(FollowResult.Requested)
        // }
    }

    // async setActiveFollowRequestsViewedAt (user: User) {
    //     await FollowRequestRepo.setActiveFollowRequestsViewedAt(user.id)
    // }
}
export default new FollowService()
