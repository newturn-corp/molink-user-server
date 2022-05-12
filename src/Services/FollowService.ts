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
    AcceptFollowRequestDTO,
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

    async follow (dbUser: User, targetId: number) {
        const { document: requestUser, isNew: isRequestUserNew } = SynchronizationService.getUser(dbUser.id)
        const { document: targetUser, isNew: isTargetUserNew } = SynchronizationService.getUser(targetId)

        try {
            // 데이터 로드
            if (isRequestUserNew) {
                const user = await UserInfoRepo.getUserInfo(dbUser.id)
                if (!user) {
                    throw new UserNotExists()
                }
                Y.applyUpdate(requestUser, Y.encodeStateAsUpdate(user))
            }
            if (isTargetUserNew) {
                const user = await UserInfoRepo.getUserInfo(dbUser.id)
                if (!user) {
                    throw new UserNotExists()
                }
                Y.applyUpdate(targetUser, Y.encodeStateAsUpdate(user))
            }

            // 이미 팔로우 중인 경우, 처리하지 않는다.
            const followMap = requestUser.getMap('followList')
            if (followMap.get(targetId.toString())) {
                throw new AlreadyFollowing()
            }

            // 이미 팔로우 요청을 보낸 경우, 처리하지 않는다.
            const myFollowRequestMap = requestUser.getMap('myFollowRequests')
            if (myFollowRequestMap.get(targetId.toString())) {
                throw new AlreadyFollowRequested()
            }

            const followWithoutApprove = requestUser.getMap('setting').get('followWithoutApprove')
            if (followWithoutApprove) {

            } else {
                targetUser.getMap('requestedFollowMap').set(dbUser.id.toString(), {

                    requestedAt: moment().toString()
                })
            }
        } catch (err) {
            if (requestUser.destoryable) {
                requestUser.destroy()
            }
            if (targetUser.destoryable) {
                targetUser.destroy()
            }
            throw err
        }
    }

    // async setActiveFollowRequestsViewedAt (user: User) {
    //     await FollowRequestRepo.setActiveFollowRequestsViewedAt(user.id)
    // }
}
export default new FollowService()
