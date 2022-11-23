const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, sequelize } = require('../../db/models');

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

        // const groupsArr2 = []
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

        // const finalArr = [];
        // groupsArr.forEach(group => {
           
        //     group.numMembers = async () => {
        //     const { id } = group;
        //     const foundGroup = await Group.findByPk(id);
        //     const members = await foundGroup.getUsers();
        //     const jsonMembers = members.map(member => member.toJSON())
            
        //     return jsonMembers.length
        //     }
        // })

    
        res.json({
            Groups: groupsArr
        })
    }
)

module.exports = router;