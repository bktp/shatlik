var express = require('express');
var router = express.Router();

const db = require('../db')

const auth = require('../auth')

router.get('/', (req, res) => {
    db
        .one('SELECT * FROM spots')
        .then((data) => {
            res.send(JSON.stringify(data))
        })
        .catch(err => res.json({ error: err.message }))
});

router.use((req, res, next) => {
    if (auth.isAuth(req.cookies.password)) next()
    else res.sendStatus(401)
})

router.put('/', (req, res) => {
    db.query("UPDATE spots SET business=${business}, stac=${stac}, semistac=${semistac}, updated=TO_DATE(${updated}, 'DD.MM.YYYY')", req.body)
        .then(() => res.sendStatus(200))
        .catch(err => res.json({ error: err.message }))
});

module.exports = router;