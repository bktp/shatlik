const express = require('express')
const router = express.Router()
const auth = require('../auth')

router.post('/', (req,res) => {
    if (auth.isAuth(req.body.password)) {
        res.cookie('password', req.body.password, {maxAge: 10000000})
        res.send()
    } else {
        res.json({error: "Something went wrong"})
    }
})

module.exports = router