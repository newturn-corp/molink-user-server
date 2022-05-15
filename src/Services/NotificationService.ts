import NotificationRepo from '../Repositories/NotificationRepo'
import User from '../Domain/User'
import { NotificationInfo } from '@newturn-develop/types-molink/dist/Domains/NotificationInfo'

class NotificationService {
    // getNotificationMessage (causeUser: User, notification: Notification) {
    //     switch (notification.notificationType) {
    //     case NotificationType.NewFollow:
    //         return `새로운 팔로워: ${causeUser.nickname}님`
    //     case NotificationType.FollowAccept:
    //         return `${causeUser.nickname}님이 팔로우 요청을 수락하셨습니다.`
    //     default:
    //         throw new Error('Unhandled Notification Type')
    //     }
    // }

    async getActiveNotifications (user: User) {
        const notifications = await NotificationRepo.getActiveNotificationsByUserId(user.id)
        return notifications.map(noti => {
            return new NotificationInfo(noti.id, noti.caused_user_id, !!noti.viewed_at, noti.created_at)
        })
    }

    async setNotificationsViewedAt (user: User) {
        await NotificationRepo.setActiveNotificationViewedAt(user.id)
    }

    async setNotificationsCheckedAt (user: User) {
        await NotificationRepo.setActiveNotificationCheckedAt(user.id)
    }
}
export default new NotificationService()
