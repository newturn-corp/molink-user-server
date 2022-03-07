import { JsonController, Get, Post, Req, Body } from 'routing-controllers'
import { makeEmptyResponseMessage } from '@newturn-develop/types-molink'
import SocketServer from "../SocketServer";
import env from "../env";

@JsonController('')
export class MainController {
    @Get('/health-check')
    async checkServerStatus () {
        return makeEmptyResponseMessage(200)
    }

    @Post('/block-traffic')
    async blockTraffic(@Req() req: Request) {
        console.log(req)
        // if (body.key !== env.secret.blockTrafficKey) {
        //     return makeEmptyResponseMessage(401)
        // }
        SocketServer.stop()
        return makeEmptyResponseMessage(200)
    }
}

export default MainController
