var express = require('express');
var router = express.Router();

const pgp = require('pg-promise')()
const db = pgp(process.env.DATABASE_URL + '?ssl=true')


router.get('/', (req, res) => {
    db.one('SELECT * FROM spots')
    .then((data) => {
        res.send(JSON.stringify(data))
    })
    .catch((err) => {
        res.send(JSON.stringify({error: err.message}))
    })
});

router.put('/', (req, res) => {
    const currentDate = new Date()
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