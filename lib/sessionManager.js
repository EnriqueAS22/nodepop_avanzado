import session from 'express-session'
import MongoStore from 'connect-mongo'

const INACTIVITY_EXPIRATION_3_DAYS = 1000 * 60 * 60 * 24 * 3

/**
 * 3 DAYS SESSION 
 */
export const middleware = session({
    name: 'nodepop-session',
    secret: 'S[hj]HJz7u5+F-2^4{DaM)r#_g"XCAb8sNq;Y',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: INACTIVITY_EXPIRATION_3_DAYS},
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/nodepop'
    })
})

export function useSessionInViews(req, res, next) {
    res.locals.session = req.session
    next()
}

export function guard(req, res, next) {
    if (!req.session.userId) {
        res.redirect(`/login?redir=${req.url}`)
        return
    }
    next()
}