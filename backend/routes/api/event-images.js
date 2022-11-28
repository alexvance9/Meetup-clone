const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Attendance, EventImage, Event, Group, GroupImage, Membership, User, sequelize } = require('../../db/models');
const { Op } = require('sequelize')

const router = express.Router();

// delete an image for an event
// must be organizer or cohost of group event belongs to?
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req;
    
    const image = await EventImage.findByPk(req.params.imageId);
    if(!image){
        const err = new Error('Event image could not be found');
        err.status = 404;
        return next(err);
    }

    const event = await Event.findByPk(image.eventId);

    const isOrgOrCohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: {
                [Op.in]: ['organizer', 'co-host']
            }
        }
    })
    if(!isOrgOrCohost){
        const err = new Error('Must be organizer or co-host of group to delete event image');
        err.status = 401;
        return next(err);
    }

    await image.destroy()

   return res.json({
        message: 'Successfully deleted'
    })
})

module.exports = router;