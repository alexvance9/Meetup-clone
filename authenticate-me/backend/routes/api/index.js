const router = require('express').Router();

router.post('/test', function (req, res) {
    res.json({ requestBody: req.body });
});


// n7Dy7VX3 - Nk - 8q02bEjLREu7LvjdP0NcYq64

module.exports = router;