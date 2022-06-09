import NotificationRepo from '../Repositories/NotificationRepo'
import User from '../Domain/User'
import { NotificationInfo } from '@newturn-develop/types-molink'

class NotificationService {
    async getActiveNotifications (user: User) {
        const notifications = await NotificationRepo.getActiveNotificationsByUserId(user.id)
        return notifications.map(noti => {
            return new NotificationInfo(noti.notification_type, noti.notification_content, noti.caused_user_id, !!noti.viewed_at, noti.created_at, noti.additional_info)
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
