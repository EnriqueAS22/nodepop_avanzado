import session from "express-session";
import MongoStore from "connect-mongo";

const INACTIVITY_EXPIRATION_3_DAYS = 1000 * 60 * 60 * 24 * 3;

/**
 * 3 DAYS SESSION
 */
export const middleware = session({
  name: "nodepop-session",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: INACTIVITY_EXPIRATION_3_DAYS },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_CONNSTR,
  }),
});

export function useSessionInViews(req, res, next) {
  res.locals.session = req.session;
  next();
}

export function guard(req, res, next) {
  if (!req.session.userId) {
    res.redirect(`/login?redir=${req.url}`);
    return;
  }
  next();
}
