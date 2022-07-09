import { randomUUID } from 'crypto'
import http from 'http'
import { WebSocket } from 'ws'
import SynchronizationService from './Services/SynchoronizationService'
import * as encoding from 'lib0/encoding'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as syncProtocol from 'y-protocols/sync'
import * as Y from 'yjs'
import { SharedDocument } from './Domain/SharedDocument'
import { MainController } from './Controllers/main'
import UserInfoRepo from './Repositories/UserInfoRepo'

export class Client {
    id: string = ''
    socket: WebSocket
    document: SharedDocument | undefined
    userId: number
    pongReceived = true
    pingInterval: NodeJS.Timer | undefined
    controller: MainController | undefined

    constructor (socket: WebSocket, request: http.IncomingMessage) {
        this.id = randomUUID()
        this.socket = socket
        this.socket.binaryType = 'arraybuffer'
        this.userId = Number(request.url?.slice(1).split('?')[0])
    }

    async init () {
        const { document, isNew } = SynchronizationService.getUser(this.userId)
        this.document = document
        document.socketMap.set(this.socket, new Set())
        this.controller = new MainController(this)

        this.pingInterval = setInterval(() => {
            if (!this.pongReceived) {
                if (document.socketMap.has(this.socket)) {
                    document.closeWebSocket(this.socket)
                }
                if (this.pingInterval) {
                    clearInterval(this.pingInterval)
                }
            } else if (document.socketMap.has(this.socket)) {
                this.pongReceived = false
                try {
                    this.socket.ping()
                } catch (e) {
                    document.closeWebSocket(this.socket)
                    if (this.pingInterval) {
                        clearInterval(this.pingInterval)
                    }
                }
            }
        }, 30000)

        {
            // send sync step 1
            const encoder = encoding.createEncoder()
            const messageSync = 0
            const messageAwareness = 1
            encoding.writeVarUint(encoder, messageSync)
            syncProtocol.writeSyncStep1(encoder, document)
            document.send(this.socket, encoding.toUint8Array(encoder))
            const awarenessStates = document.awareness.getStates()
            if (awarenessStates.size > 0) {
                const encoder = encoding.createEncoder()
                encoding.writeVarUint(encoder, messageAwareness)
                encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(document.awareness, Array.from(awarenessStates.keys())))
                document.send(this.socket, encoding.toUint8Array(encoder))
            }
        }

        if (isNew) {
            let user = await UserInfoRepo.getUserInfo(this.userId)
            if (!user) {
                user = new Y.Doc()
                await UserInfoRepo.persistUserInfoUpdate(this.userId, Y.encodeStateAsUpdate(user))
            }

            Y.applyUpdate(document, Y.encodeStateAsUpdate(user))
        }
    }
}
