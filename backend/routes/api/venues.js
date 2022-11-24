const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// edit venue by its id
// requires user be cohost or organizer
// refactor later to use auth middleware
router.put('/:venueId', requireAuth, isOrganizerOrCoHost, async (req, res, next) => {
    const venue = await Venue.findByPk(req.params.venueId);
    const { address, city, state, lat, lng } = req.body;

    await venue.update({
        address,
        city,
        state,
        lat,
        lng
    })
    
    
    res.json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    })

})

module.exports = router;