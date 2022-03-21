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
        SocketServer.stop()
        return makeEmptyResponseMessage(200)
    }
}

export default MainController
