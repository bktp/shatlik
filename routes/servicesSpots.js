var express = require('express');
var router = express.Router();

let db = require('../db')

let isAuth = require('../auth')

router.get('/', (req, res) => {
    db.one('SELECT * FROM spots')
    .then((data) => {
        res.send(JSON.stringify(data))
    })
    .catch((err) => {
        res.send(JSON.stringify({error: err.message}))
    })
});

router.use((req, res, next) => {
    isAuth(req.cookies.password) ? next() : res.send()
})

router.put('/', (req, res) => {
    console.log(req.body)
    db.query('UPDATE spots SET business=${business}, stac=${stac}, semistac=${semistac}, updated=${updated}', req.body)
    .then(() => {
        res.send("Success")
    })
    .catch((err) => {
        res.send(JSON.stringify({error:err.message}))
    })
});

module.exports = router;