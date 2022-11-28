const router = require('express').Router();
const eventsRouter = require('./events.js');
const eventImgRouter = require('./event-images.js')
const groupsRouter = require('./groups.js');
const groupImgRouter = require('./group-images.js')
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const venuesRouter = require('./venues');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/events', eventsRouter);
router.use('/event-images', eventImgRouter);
router.use('/groups', groupsRouter);
router.use('/group-images', groupImgRouter);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/venues', venuesRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});




// test route
// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//     '/require-auth',
//     requireAuth,
//     (req, res) => {
//         return res.json(req.user);
//     }
// );



// TEST setTokenCookie function
// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
// });






module.exports = router;