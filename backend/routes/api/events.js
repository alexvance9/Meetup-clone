const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Attendance, EventImage, Event, Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

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
                model: EventImage,
                attributes: ['url'],
                where: {
                    preview: true
                },
                required: false
            }
        ] 
    })

    const jsonEvents = [];

    const findNumAttending = async function (eventId) {
        return await Attendance.count({
            where: {
                eventId: eventId
            }
        })

    }
    for (let event of events) {
        const jsonEvent = event.toJSON();

        const numAttending = await findNumAttending(jsonEvent.id);
        console.log(numAttending);
        jsonEvent.numAttending = numAttending;

        if (event.EventImages.length) {
            jsonEvent.previewImage = event.EventImages[0].url
        } else {
            jsonEvent.previewImage = "No preview image provided"
        }
        delete jsonEvent.EventImages;
        delete jsonEvent.createdAt;
        delete jsonEvent.updatedAt;
        delete jsonEvent.capacity;
        delete jsonEvent.price;
        delete jsonEvent.description;

        jsonEvents.push(jsonEvent)
    }
    // console.log(jsonEvents)



    res.json({
        Events: jsonEvents
    });
    
})

module.exports = router;