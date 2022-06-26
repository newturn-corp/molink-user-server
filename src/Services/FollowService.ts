import {
    GetFollowMapResponseDTO,
    GetMyFollowRequestResponseDTO,
    User
} from '@newturn-develop/types-molink'
import BlogFollowRepo from '../Repositories/BlogFollowRepo'
import BlogFollowRequestRepo from '../Repositories/BlogFollowRequestRepo'
import { ViewerAPI } from '../API/ViewerAPI'

export class FollowService {
    viewerAPI: ViewerAPI

    constructor (viewerAPI: ViewerAPI) {
        this.viewerAPI = viewerAPI
    }

    async getFollowMap (user: User) {
        const followMap: any = {}
        const follows = await BlogFollowRepo.getUserBlogFollows(user.id)
        for (const follow of follows) {
            followMap[follow.user_id] = true
        }
        return new GetFollowMapResponseDTO(followMap)
    }

    // 내가 요청 중인 팔로우들을 가져오는 API
    async getMyActiveFollowRequestMap (user: User) {
        const followRequestMap: any = {}
        const followRequests = await BlogFollowRequestRepo.getUserActiveBlogFollowRequests(user.id)
        for (const followRequest of followRequests) {
            followRequestMap[followRequest.blog_id] = true
        }
        return new GetMyFollowRequestResponseDTO(followRequestMap)
    }
}
