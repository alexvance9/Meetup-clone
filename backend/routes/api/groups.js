const express = require('express');
const { setTokenCookie, restoreUser, requireAuth, isOrganizer } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// post create new image for group
// current user must be organizer for the group
// created new auth middleware to check for organizer
router.post('/:groupId/images', requireAuth, isOrganizer, async (req, res, next) => {
    const { url, preview } = req.body
    const group = await Group.findByPk(req.params.groupId);
    const newGroupImage = await group.createGroupImage({
        url,
        preview
    })

    res.json(newGroupImage)
})


// post create new group
router.post('/', requireAuth, async (req, res, next) => {
    const {user} = req;
    const { name, about, type, private, city, state } = req.body;
    console.log(about)
    console.log(type)

    try {
        const newGroup = await Group.create({
            organizerId: user.id,
            name,
            about,
            type,
            private,
            city,
            state
        })
        const newMembership = await Membership.create({
            userId: user.id,
            groupId: newGroup.id,
            status: "organizer"
        })
        console.log(newMembership);
    
        res.json(newGroup)
    } catch (err) {
        err.status = 400;
        next(err)
    }
})


// Get current users groups
router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    // find user by userid and include groups
    const userGroups = await User.findByPk(user.id, {
        include: [
        {
            model: Group,
            as: "member",
            include: [
                {
                    model: User,
                    as: "members"
                },
                {
                    model: GroupImage,
                    attributes: ['url'],
                    where: {
                        preview: true,
                    },
                    required: false
                },
            ],
        },
    ]
    });
    const jsonGroups = userGroups.toJSON()
    // grab the list of groups under alias "member"
    const groups = jsonGroups.member;
    // for each group in array,
    // remove unneccessary eles and get num members and previmg url
    groups.forEach(group => {
        delete group.Membership

        group.numMembers = group.members.length
        delete group.members

        if (group.GroupImages.length) {
            group.previewImage = group.GroupImages[0].url
        } else {
            group.previewImage = "No preview image provided"
        }
        delete group.GroupImages

    })
    // console.log(groups)
    // 

    res.json({
        Groups: [
            ...groups
        ]
    })
})


// GET all groups
router.get(
    '/',
    async (req, res, next) => {
        
        const allGroups = await Group.findAll({
            include: [
                {
                    model: User,
                    as: "members"
                },
                {
                model: GroupImage,
                attributes: ['url'],
                where: {
                    preview : true,
                },
                required: false
                },
            ],
            
        });
    
        const groupsArr = [];
        
        // JSON groups
        await allGroups.forEach( async group => {
        
            jsonGroup = group.toJSON();
     
        groupsArr.push(jsonGroup)
        })

        groupsArr.forEach(group => {
            if (group.GroupImages.length) {
                group.previewImage = group.GroupImages[0].url
            } else {
                group.previewImage = "No preview image provided"
            }
            delete group.GroupImages
            
            group.numMembers = group.members.length
            delete group.members
            
        })

        res.json({
            Groups: groupsArr
        })
    }
)


// Get group by group id
router.get(
    '/:groupId',
     async (req, res, next) => {
        let id = req.params.groupId;
        
        const group = await Group.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "members"
                },
                {
                    model: GroupImage,
                    required: false
                },
                {
                    model: User,
                    as: 'Organizer',
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Venue,
                    required: false,
                }
            ],
            
        });
        
        if (group){
    const jsonGroup = group.toJSON()
    jsonGroup.numMembers = group.members.length;
    delete jsonGroup.members;
        
    res.json({
        jsonGroup
    })
    } else {
        const err = new Error()
        err.status = 404;
        err.message = "Group couldn't be found";
        next(err)
    }
})



module.exports = router;