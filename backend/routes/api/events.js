const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer, isOrganizerOrCoHost } = require('../../utils/auth');
const { Attendance, EventImage, Event, Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');
const {Op, json} = require('sequelize')
const router = express.Router();

const isOrgorCohost = async (req, _res, next) => {
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

const isMember = async (req, _res, next) => {
    const { user } = req;
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        const err = new Error('Event could not be found');
        err.status = 404;
        return next(err);
    }
    const jsonEvent = event.toJSON();
    const isM = await Membership.findOne({
        where: {
            groupId: jsonEvent.groupId,
            userId: user.id
        }
    })
    if(isM) return true;
    else return false;
}

// request to attend event by id
// must be member of group
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const {user} = req;
    if(await isMember(req, res, next)){
        const attendance = await Attendance.findOne({
            where: {
                userId: user.id,
                eventId: req.params.eventId
            }
        })
        if (attendance){
            const jsonAttendance = attendance.toJSON()
            if(jsonAttendance.status === 'pending'){
                const err = new Error('Attendance has already been requested');
                err.status = 400;
                return next(err);
            } else {
                const err = new Error('User is already an attendee of the event');
                err.status = 400;
                return next(err);
            }
        }
        
        const newAttendee = await Attendance.create({
            userId: user.id,
            eventId: req.params.eventId,
            status: 'pending'
        })
        // console.log(newAttendee)

        return res.json({
            userId: newAttendee.userId,
            status: newAttendee.status
        })
    } else {
        const err = new Error('User must be member of group to attend event')
        err.status = 403;
        return next(err)
    }
})

// change status of attendance for event by id
// must be o or c
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const {user} = req;
    const { userId, status } = req.body;

    if (!(await isOrgorCohost(req, res, next))){
        const err = new Error('Must be event host or co-host');
        err.status = 403;
        return next(err);
    }
    
    const attendance = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: req.params.eventId
        }
    })

    if(!attendance){
        const err = new Error('Attendance between the user and the event does not exist');
        err.status = 404;
        return next(err);
    }
    

    if (status === 'pending'){
        const err = new Error('Cannot change an attendance to pending');
        err.status = 400;
        return next(err);
    }


    await attendance.update({
        status
    })

    const jsonAttendance = attendance.toJSON();
    return res.json({
        id: jsonAttendance.id,
        eventId: jsonAttendance.eventId,
        userId: jsonAttendance.userId,
        status: jsonAttendance.status
    })
})

// delete an attendance to an event
// must be attendee or org/cohost
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const { user } = req;
    const { memberId } = req.body;
    const attendance = await Attendance.findOne({
        where: {
            userId: memberId,
            eventId: req.params.eventId
        }
    })
    if (!attendance){
        const err = new Error('Attendance does not exist for this user');
        err.status = 404;
        return next(err);
    }
    const event = await Event.findByPk(req.params.eventId)
    if(!event){
        const err = new Error('Event could not be found')
        err.status = 404;
        return next(err);
    }
    const group = await Group.findByPk(event.groupId)
    if ((user.id === memberId) || (user.id === group.organizerId)){
        await attendance.destroy()

       return res.json({
            message: 'successfully deleted attendance from event'
        })
    } else {
        const err = new Error('Only the User or organizer may delete an attendance')
        err.status = 403;
        return next(err);
    }
})

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
    if (!eventWithAttendees){
        const err = new Error('Could not find event');
        err.status = 404;
        return next(err)
    }
    const jsonEvent = eventWithAttendees.toJSON()
    const attendees = jsonEvent.Users;
    // console.log(attendees)
    const idx = -1;
    for (let attendee of attendees){
        // console.log(await isOrgorCohost(req))
        if(!(await isOrgorCohost(req, res, next))){
           if(attendee.Attendance.status === 'pending')
            attendees.splice(idx, 1)
        }
        delete attendee.Attendance.id
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
        err.status = 403;
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

// delete an event by id
// must be org or cohost
router.delete('/:eventId', requireAuth, isOrganizerOrCoHost, async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId)

    await event.destroy()
    return res.json({
        message: 'successfully deleted'
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
    const jsonEvent = event.toJSON()
    delete jsonEvent.createdAt
    delete jsonEvent.updatedAt
    
    res.json(jsonEvent)
   
})

// get details of an event by event id
router.get('/:eventId', async (req, res, next) => {

    const event = await Event.findByPk(req.params.eventId, {
        include: [
            {
                model: Group,
                attributes: ['id', 'organizerId', 'name', 'private', 'city', 'state']
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
    let { page, size, name, type, startDate } = req.query;

    let pagination = {};
    if (!size || size > 20){
        pagination.limit = 20;
    } else if(size < 1){
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = {
            size: 'size must be greater than or equal to 1'
        }
        return next(err)
    } else {
        pagination.limit = size;
    }
    if(!page || page > 10){
        page = 1
    } else if (page < 1){
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = {
            page: 'page must be greater than or equal to 1'
        }
        return next(err)
    } else {
        pagination.offset = size * (page - 1)
    }

    let where = {};
    if(name){
        if(typeof name !== "string"){
            const err = new Error('Validation Error')
            err.status = 400;
            err.errors = {
                name: 'name must be a string'
            }
            return next(err)
        }
        where.name = name;
    }
    if(type){
        let lcType = type.toLowerCase()
        if(lcType !== 'online' && lcType !== "inperson"){
            const err = new Error('Validation Error')
            err.status = 400;
            err.errors = {
                type: "type must be Online or In Person"
            }
            return next(err);
        }
        
        if(lcType === 'inperson'){
            where.type = "In Person"
        }
        if(lcType === 'online'){
            where.type = "Online"
        }
    }
    if(startDate){
        if (startDate.getTime() === NaN){
            const err = new Error('Validation Error')
            err.status = 400;
            err.errors = {
                startDate: "start date must be valid date"
            }
            return next(err)
        } 
        where.startDate = { [Op.startsWith]: startDate}
        // maybe need to change this to json date and then compare greater
        // than or equal to... 
    }
    

    const events = await Event.findAll({
        where: where,
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
        ],
        ...pagination 
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
        // console.log(numAttending);
        jsonEvent.numAttending = numAttending;

        if (event.EventImages.length) {
            jsonEvent.previewImage = event.EventImages[0].url
        } else {
            jsonEvent.previewImage = false;
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