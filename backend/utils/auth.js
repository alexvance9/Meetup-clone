// User Auth Middlewares

const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// function to be used in login and signup routes.
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};


// will be connected to API router so all API route handlers will check for current logged in user.
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// read.me says to put restoreUser as first ele in array with requireAuth, but code snippet was different.
//  we will see if causes probs later.

// will be connected directly to routehandlers where there needs to be a current user logged in for the
// actions in those route handlers.
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = ['Authentication required'];
    err.status = 401;
    return next(err);
}

// verify that current user is group organizer

const isOrganizer = async function (req, res, next) {
    const { user } = req;
    const {groupId} = req.params;

    const currentGroup = await Group.findByPk(groupId)
    const jsonGroup = currentGroup.toJSON()
    if (jsonGroup.organizerId === user.id) return next();

    const err = new Error('Must be group organizer');
    err.title = 'Must be group organizer';
    err.errors = ['Must be group organizer'];
    err.status = 401;
    return next(err);

}

module.exports = { setTokenCookie, restoreUser, requireAuth, isOrganizer };