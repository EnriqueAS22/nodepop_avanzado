import User from '../models/Users.js'

export function index(req, res, next) {
    res.locals.error = ''
    res.locals.email = ''
    res.render('login')
}

/**
 * LOGIN
 */
export async function postLogin(req, res, next) {
    try {
        const { email, password } = req.body
        const redir = req.query.redir
    
        const user = await User.findOne({ email: email })
    
        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            res.render('login')
            return
        }
    
        req.session.userId = user.id

        res.redirect(redir ? redir: '/')

    } catch (error) {
        next(error)
    }
}

/**
 * LOGOUT
 */
export function logout(req, res, next) {
    req.session.regenerate(err => {
        if (err) {
            next(err)
            return
        }
        res.redirect('/')
    })
}