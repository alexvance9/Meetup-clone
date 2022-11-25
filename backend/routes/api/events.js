const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Event, Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// get all events
router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
        include:[
            {
                model: Venue,
                attributes: ['id', 'city', 'state'],
                required: false,
            },
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: User,
            }
        ] 
    })
    res.json({
        Events: events
    });
    
})

module.exports = router;