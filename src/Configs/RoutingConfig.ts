import { RoutingControllersOptions } from 'routing-controllers'
import MainController from '../Controllers/http'

import { CustomErrorHandler } from '../Middlewares/CustomErrorHandler'
import { AuthMiddleware } from '../Middlewares/AuthMiddleware'
import FollowController from '../Controllers/follow'
import NotificationController from '../Controllers/notifications'
import { InternalFileUploadController } from '../Controllers/internal/file-upload'
import { InternalController } from '../Controllers/internal/http'

const routingControllersOptions: RoutingControllersOptions = {
    defaultErrorHandler: false,
    middlewares: [CustomErrorHandler],
    controllers: [
        MainController,
        FollowController,
        NotificationController,
        InternalFileUploadController,
        InternalController
    ],
    authorizationChecker: AuthMiddleware.authorization,
    currentUserChecker: AuthMiddleware.currentUser
}

export { routingControllersOptions }
