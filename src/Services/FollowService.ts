import {
    AcceptFollowRequestDTO,
    ESUser,
    FollowRequestDTO,
    GetFollowerMapResponseDTO,
    GetFollowInfoResponseDTO,
    GetFollowMapResponseDTO,
    GetMyFollowRequestResponseDTO,
    GetRequestedFollowsResponseDTO,
    NotificationType,
    RejectFollowRequestDTO,
    User
} from '@newturn-develop/types-molink'
import { UserNotExists } from '../Errors/ProfileError'
import {
    AlreadyFollowing,
    AlreadyFollowRequested,
    AlreadyHandledRequest,
    FollowRequestNotExists,
    NotYourFollowRequest
} from '../Errors/FollowError'
import FollowRepo from '../Repositories/FollowRepo'
import FollowRequestRepo from '../Repositories/FollowRequestRepo'
import UserRepo from '../Repositories/UserRepo'
import ESUserRepo from '../Repositories/ESUserRepo'
import NotificationRepo from '../Repositories/NotificationRepo'

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

    async getFollowerMap (user: User) {
        const followerMap: any = {}
        const followers = await FollowRepo.getUserFollowers(user.id)
        for (const follower of followers) {
            followerMap[follower.following_user_id] = true
        }
        return new GetFollowerMapResponseDTO(followerMap)
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

    async getRequestedFollows (user: User) {
        const requests = await FollowRequestRepo.getUserActiveFollowRequests(user.id)
        if (requests.length === 0) {
            return new GetRequestedFollowsResponseDTO([])
        }
        const followers = await ESUserRepo.getUserInfoListByIdList(requests.map(req => req.follower_id))
        const followerMap = new Map<number, ESUser>()
        followers.forEach(follower => followerMap.set(Number(follower.id), follower))
        return new GetRequestedFollowsResponseDTO(requests.map(request => {
            const follower = followerMap.get(request.follower_id) as ESUser
            return {
                id: request.id,
                followerId: Number(follower.id),
                profileImgUrl: follower.profileImageUrl,
                nickname: follower.nickname,
                isViewed: !!request.viewed_at,
                createdAt: request.created_at
            }
        }))
    }

    async getFollowInfo (user: User, targetUserId: number) {
        const { count: followCount } = await FollowRepo.getUserFollowCount(targetUserId)
        const { count: followingCount } = await FollowRepo.getUserFollowingCount(targetUserId)
        return new GetFollowInfoResponseDTO(followCount, followingCount)
    }

    async rejectFollowRequest (user: User, dto: RejectFollowRequestDTO) {
        const request = await FollowRequestRepo.getFollowRequest(dto.followRequestId)
        if (!request) {
            throw new FollowRequestNotExists()
        }
        if (request.user_id !== user.id) {
            throw new NotYourFollowRequest()
        }
        if (request.accepted_at || request.rejected_at) {
            throw new AlreadyHandledRequest()
        }
        await FollowRequestRepo.setFollowRequestRejected(request.id)
    }

    async acceptFollowRequest (user: User, dto: AcceptFollowRequestDTO) {
        const request = await FollowRequestRepo.getFollowRequest(dto.followRequestId)
        if (!request) {
            throw new FollowRequestNotExists()
        }
        if (request.user_id !== user.id) {
            throw new NotYourFollowRequest()
        }
        if (request.accepted_at || request.rejected_at) {
            throw new AlreadyHandledRequest()
        }
        await FollowRequestRepo.setFollowRequestAccepted(request.id)
        await FollowRepo.saveFollow(user.id, request.follower_id)
        const follower = await UserRepo.getActiveUserById(request.follower_id)
        if (follower) {
            await NotificationRepo.saveNotification(
                user.id,
                NotificationType.FollowAccept,
                `<b>${follower.nickname}</b>님이 팔로우 요청을 수락하셨습니다.`,
                request.follower_id,
                request.follower_id.toString()
            )
        }
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

    async setActiveFollowRequestsViewedAt (user: User) {
        await FollowRequestRepo.setActiveFollowRequestsViewedAt(user.id)
    }
}
export default new FollowService()
