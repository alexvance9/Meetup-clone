const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Group, GroupImage, Membership, User, sequelize } = require('../../db/models');
const { json } = require('express');
const { Op } = require('sequelize')

const router = express.Router();

// delete a group image
// user must be organizer or co-host

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const {user} = req;
    const image = await GroupImage.findByPk(req.params.imageId);
    if(!image){
        const err = new Error('Group Image could not be found');
        err.status = 404;
        return next(err);
    }
    // console.log(image.groupId);
    const isOrgOrCohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: image.groupId,
            status: {
                [Op.in]: ['organizer', 'co-host']
            }
        }
    })
    
    if(!isOrgOrCohost){
        const err = new Error('Must be organizer or co-host to delete group image');
        err.status = 403;
        return next(err);
    }

    await image.destroy()

    res.json({
        message: "Successfully deleted"
    })

})

module.exports = router