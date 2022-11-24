const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// get all events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll()
    res.json(events);
})

module.exports = router;