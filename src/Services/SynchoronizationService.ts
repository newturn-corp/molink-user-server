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
}
export default new SynchronizationService()
