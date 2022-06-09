import { BaseRepo } from '@newturn-develop/molink-utils'
import { Notification, NotificationType } from '@newturn-develop/types-molink'

class NotificationRepo extends BaseRepo {
    public getActiveNotificationsByUserId (userId: number): Promise<Notification[]> {
        const queryString = 'SELECT * FROM NOTIFICATION_TB WHERE user_id = ? AND checked_at IS NULL'
        return this._selectPlural(queryString, [userId]) as Promise<Notification[]>
    }

    public saveFollowAcceptNotification (userId: number, followerId: number) {
        const queryString = 'INSERT INTO NOTIFICATION_TB(user_id, notification_type, caused_user_id) VALUES(?, ?, ?)'
        return this._insert(queryString, [followerId, NotificationType.FollowAccept, userId])
    }

    async setActiveNotificationViewedAt (userId: number) {
        const queryString = 'UPDATE NOTIFICATION_TB SET viewed_at = ? WHERE user_id = ? AND checked_at IS NULL AND viewed_at IS NULL'
        return this._update(queryString, [new Date(), userId])
    }

    async setActiveNotificationCheckedAt (userId: number) {
        const queryString = 'UPDATE NOTIFICATION_TB SET checked_at = ? WHERE user_id = ? AND checked_at IS NULL AND viewed_at IS NOT NULL'
        return this._update(queryString, [new Date(), userId])
    }

    public saveNotification (userId: number, notificationType: NotificationType, notificationContent: string, causedUserId: number, additionalInfo: string) {
        const queryString = 'INSERT INTO NOTIFICATION_TB(user_id, notification_type, notification_content, caused_user_id, additional_info) VALUES(?, ?, ?, ?, ?)'
        return this._insert(queryString, [userId, notificationType, notificationContent, causedUserId, additionalInfo])
    }
}
export default new NotificationRepo()
