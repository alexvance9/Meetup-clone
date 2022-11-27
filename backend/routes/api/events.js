const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Attendance, EventImage, Event, Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');
const {Op} = require('sequelize')
const router = express.Router();

const isOrgorCohost = async (req) => {
    const {user} = req;
    const event = await Event.findByPk(req.params.eventId);
    if(!event){
        const err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    }
    const isOorC = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: user.id,
            status: {
                [Op.in]: ['host', 'co-host']
            }
        }
    })
    if(isOorC) return true;
    else return false;

}

// get all attendees of event by id
// no auth
router.get('/:eventId/attendees', async (req, res, next) => {
    // console.log(req.user)
    
    const eventWithAttendees = await Event.findByPk(req.params.eventId, {
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })
    const jsonEvent = eventWithAttendees.toJSON()
    const attendees = jsonEvent.Users;
    // console.log(attendees)
    const idx = -1;
    for (let attendee of attendees){
        // console.log(await isOrgorCohost(req))
        if(!(await isOrgorCohost(req))){
           if(attendee.Attendance.status === 'pending')
            attendees.splice(idx, 1)
        }
        delete attendee.Attendance.eventId;
        delete attendee.Attendance.userId;
        delete attendee.Attendance.createdAt;
        delete attendee.Attendance.updatedAt;
    }
    // console.log(attendees)
    
    res.json({
        Attendees: attendees
    })
})

// add image to event based on event id
// require auth attendee host, or cohost
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const { eventId } = req.params;
    const event = await Event.findByPk(eventId);
    if (!event){
        const err = new Error("Group couldn't be found");
        err.status = 404;
        return next(err)
    }
   
    const {user} = req;
    const attendance = await Attendance.findOne({
        where: {
            eventId: req.params.eventId,
            userId: user.id,
            status: {
                [Op.in]: ['attendee', 'co-host', 'host']
            }
        }
    })
    if (!attendance){
        const err = new Error('You do not have permission to add a photo to this event.');
        err.status = 401;
        return next(err)
    }
    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
        eventId,
        url,
        preview
    })
    res.json({
        id: newEventImage.id,
        url,
        preview
    })

})

// edit event by id
// require organizer or cohost
router.put('/:eventId', requireAuth, isOrganizerOrCoHost, async(req, res, next) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
    const event = await Event.findByPk(req.params.eventId);
    const venue = await Venue.findByPk(venueId);
    if(!venue){
        const err = new Error('Venue could not be found');
        err.status = 404;
        return next(err)
    }
//    console.log(startDate)
//    const sDateOnly = startDate.split(' ')[0]
//    console.log(sDateOnly)
//    const sTime = new Date(sDateOnly).getTime()
//    console.log(sTime);
   
    await event.update({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate, 
            endDate
    })
    
    res.json(event)
   
})

// get details of an event by event id
router.get('/:eventId', async (req, res, next) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'],
                required: false,
            },
            {
                model: EventImage,
                attributes: ['id','url','preview'],
                required: false
            }
        ]
    })

    if(event){
    const findNumAttending = async function (eventId) {
        return await Attendance.count({
            where: {
                eventId: eventId
            }
        })

    }
    const jsonEvent = event.toJSON();
    const numAttending = await findNumAttending(jsonEvent.id)
    // console.log(numAttending);
    jsonEvent.numAttending = numAttending;
    delete jsonEvent.createdAt;
    delete jsonEvent.updatedAt;

    res.json(jsonEvent)
    }   else {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        next(err)
    }
})


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