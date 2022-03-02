import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidV4 } from 'uuid'
import http, { IncomingMessage } from 'http'
import { Client } from './Client'
import env from './env'
import { parseCookie } from '@newturn-develop/molink-utils'
import jwt from 'jsonwebtoken'
import { JWTUser } from '@newturn-develop/types-molink'
import UserRepo from './Repositories/UserRepo'
import moment from 'moment-timezone'

class SocketServer {
    nodeId: string
    httpServer: http.Server | null = null
    server: WebSocketServer | null = null
    isBlockTraffic: boolean = false
    clientMap: Map<string, Client> = new Map<string, Client>()

    constructor () {
        this.nodeId = uuidV4()
    }

    start (httpServer: http.Server) {
        this.server = new WebSocketServer({ noServer: true })
        this.httpServer = httpServer
        this.server.on('connection', async (socket, request) => {
            console.log(`${request.headers['x-real-ip']} [${moment().format('YYYY-MM-DD HH:mm:ss')}] upgrade ${request.headers['user-agent']}`)
            await this.handleConnect(socket, request)
        })
        this.httpServer.on('upgrade', (req, socket, head) => {
            console.log(`${req.headers['x-real-ip']} [${moment().format('YYYY-MM-DD HH:mm:ss')}] upgrade ${req.headers['user-agent']}`)
            const id = this.authUser(req)
            if (!id) {
                console.log(`${req.headers['x-real-ip']} [${moment().format('YYYY-MM-DD HH:mm:ss')}] auth fail ${req.headers['user-agent']}`)
                return
            }

            this.server?.handleUpgrade(req, socket, head, (ws) => {
                req.headers.userId = id.toString()
                this.server?.emit('connection', ws, req)
            })
        })
        this.listenServer()
    }

    authUser (req: IncomingMessage) {
        const { cookie } = req.headers
        if (!cookie) {
            return false
        }
        const { token } = parseCookie(cookie)
        if (!token) {
            return false
        }
        try {
            const payload = jwt.verify(token, env.jwt) as JWTUser
            return payload.id
        } catch (e) {
            return false
        }
    }

    async handleConnect (socket: WebSocket, request: http.IncomingMessage) {
        const userId = Number(request.headers.userId)
        const user = await UserRepo.getActiveUserById(userId)
        const client = new Client(socket, request)
        await client.init()
        this.clientMap.set(client.id, client)
        console.log(`${request.headers['x-real-ip']} [${moment().format('YYYY-MM-DD HH:mm:ss')}] ${client.id} connect ${user?.id} ${user?.nickname} ${request.headers['user-agent']}`)
    }

    async handleDisconnect (clientId: string) {
        this.clientMap.delete(clientId)
    }

    listenServer () {
        this.httpServer?.listen(env.port, env.host, () => {
            console.log(`user server start at ${env.port}`)
        })
    }

    stop () {
        this.isBlockTraffic = true
        const clients = this.clientMap.values()
        for (const client of clients) {
            client.socket.close()
        }
        this.httpServer?.close()
    }
}
export default new SocketServer()
