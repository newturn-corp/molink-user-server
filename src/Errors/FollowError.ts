import { CustomError } from './Common'

export class AlreadyFollowRequested extends CustomError {}

export class NotYourFollowRequest extends CustomError {}

export class AlreadyFollowing extends CustomError {}

export class AlreadyHandledRequest extends CustomError {}

export class FollowRequestNotExists extends CustomError {}
