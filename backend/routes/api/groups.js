const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

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

    const jsonGroup = group.toJSON()
    jsonGroup.numMembers = group.members.length;
    delete jsonGroup.members;
         

        //  // JSON groups
        //  await allGroups.forEach(async group => {
        //      jsonGroup = group.toJSON()
        //      groupsArr.push(jsonGroup)
        //  })

        //  groupsArr.forEach(group => {
        //      group.numMembers = group.members.length
        //      delete group.members

        //  })

         res.json({
             jsonGroup
         })
})

module.exports = router;