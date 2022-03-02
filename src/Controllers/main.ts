import { Client } from '../Client'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import { MessageType } from '../Enum'
import { Data as WSData } from 'ws'
import * as awarenessProtocol from 'y-protocols/awareness'
import * as syncProtocol from 'y-protocols/sync'
import CacheService from '../Services/CacheService'
import { SharedDocument } from '../Domain/SharedDocument'
import moment from "moment-timezone";
import SocketServer from "../SocketServer";
import {
    messageYjsSyncStep1,
    messageYjsSyncStep2,
    messageYjsUpdate,
    readSyncStep1,
    readSyncStep2, readUpdate
} from "y-protocols/sync";

export class MainController {
    client: Client

    constructor (client: Client) {
        this.client = client
        this.client.socket.on('message', (message: WSData) => {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${client.id} message ${this.client.userId}`)
            this.handleMessage(new Uint8Array(message as ArrayBuffer))
        })

        this.client.socket.on('close', async () => {
            this.client.document?.closeWebSocket(this.client.socket)
            await SocketServer.handleDisconnect(client.id)
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${client.id} close ${this.client.userId}`)
            if (this.client.pingInterval) {
                clearInterval(this.client.pingInterval)
            }
        })

        this.client.socket.on('pong', () => {
            this.client.pongReceived = true
        })
    }

    handleMessage (message: Uint8Array) {
        const encoder = encoding.createEncoder()
        const decoder = decoding.createDecoder(message)
        const messageType = decoding.readVarUint(decoder) as MessageType
        const document = this.client.document as SharedDocument
        switch (messageType) {
        case MessageType.MessageSync: {
            encoding.writeVarUint(encoder, MessageType.MessageSync)
            readSyncMessage(decoder, encoder, document, this.client.socket)

            if (encoding.length(encoder) > 1) {
                console.log('document send')
                document.send(this.client.socket, encoding.toUint8Array(encoder))
            }
            break
        }
        case MessageType.MessageAwareness: {
            const update = decoding.readVarUint8Array(decoder)
            CacheService.publisher.publishBuffer(document.awarenessChannel, Buffer.from(update))
            awarenessProtocol.applyAwarenessUpdate(document.awareness, update, this.client.socket)
            break
        }
        default: throw new Error('unreachable')
        }
    }
}

export const readSyncMessage = (decoder: any, encoder: any, doc: any, transactionOrigin: any) => {
    const messageType = decoding.readVarUint(decoder)
    console.log('read-sync-message')
    console.log(messageType)
    switch (messageType) {
        case messageYjsSyncStep1:
            readSyncStep1(decoder, encoder, doc)
            break
        case messageYjsSyncStep2:
            readSyncStep2(decoder, doc, transactionOrigin)
            break
        case messageYjsUpdate:
            readUpdate(decoder, doc, transactionOrigin)
            break
        default:
            throw new Error('Unknown message type')
    }
    return messageType
}
