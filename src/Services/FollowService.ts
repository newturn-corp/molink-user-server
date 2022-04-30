// import { GetFollowRequestResponseDTO, RejectFollowRequestDTO } from '../Dtos/FollowDTO'
// import { FollowResponseDTO, UserWithProfileDTO } from '../Dtos/UserDTO'
// import { UserNotExists } from '../Errors/AuthError'
// import { AlreadyHandledRequest, FollowRequestNotExists, NotYourFollowRequest } from '../Errors/FollowError'
// import { AlreadyFollowing, AlreadyFollowRequested } from '../Errors/UserError'
// import FollowRepo from '../repo/FollowRepo'
// import FollowRequestRepo from '../repo/FollowRequestRepo'
// import NotificationRepo from '../repo/NotificationRepo'
// import { AcceptFollowRequestDTO } from '@newturn-develop/types-molink'

import { AcceptFollowRequestDTO, RejectFollowRequestDTO, User } from '@newturn-develop/types-molink'

export enum FollowResult {
    Succeeded = 'succeeded',
    Requested = 'requested'
}

class FollowService {
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

    // async setActiveFollowRequestsViewedAt (user: User) {
    //     await FollowRequestRepo.setActiveFollowRequestsViewedAt(user.id)
    // }
}
export default new FollowService()
