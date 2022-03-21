import { SharedDocument } from '../Domain/SharedDocument'

class SynchronizationService {
    private userMap = new Map<number, SharedDocument>()

    getUser (userId: number) {
        const existing = this.userMap.get(userId)
        if (existing) {
            return {
                document: existing,
                isNew: false
            }
        }

        const document = new SharedDocument(userId)
        document.gc = true
        this.userMap.set(userId, document)
        return {
            document,
            isNew: true
        }
    }

    deleteUser (userId: number) {
        this.userMap.delete(userId)
    }

    getServiceStats () {
        const documents = this.userMap.values()
        let documentCount = 0
        let totalUserCount = 0
        let maxUserCount = 0
        let maxUserID = null
        for (const document of documents) {
            documentCount += 1
            const documentUserCount = [...document.socketMap.values()].length
            totalUserCount += documentUserCount
            if (documentUserCount > maxUserCount) {
                maxUserCount = documentUserCount
                maxUserID = document.id
            }
        }
        return {
            documentCount,
            totalUserCount,
            maxUserCount,
            maxUserID
        }
    }
}
export default new SynchronizationService()
