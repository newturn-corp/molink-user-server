import express from 'express'
import env from '../env'
import moment from 'moment-timezone'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import userAgent from 'express-useragent'

export function useMiddleware (app: express.Application) {
    morgan.token('date', () => {
        return moment().format('YYYY-MM-DD HH:mm:ss')
    })
    const logFormat = ':remote-addr [:date[clf]] ":method :url" :status :res[content-length] - :response-time ms ":user-agent"'
    app.use(cookieParser(env.secret.cookie))
    app.use(morgan(logFormat))
    app.use(userAgent.express())
}
