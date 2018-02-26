var express = require('express');
var router = express.Router();

const db = require('../db')

const auth = require('../auth')

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
    console.log("Проверка пароля началась")
    console.log(req.cookies.password)
    if (auth.isAuth(req.cookies.password)) 
    {
        console.log("Проверка пройдена")
        next()
    }
})

router.put('/', (req, res) => {
    console.log(req.body)
    db.query("UPDATE spots SET business=${business}, stac=${stac}, semistac=${semistac}, updated=TO_DATE(${updated}, 'DD.MM.YYYY')", req.body)
    .then(() => {
        res.send("Success")
    })
    .catch((err) => {
        res.send(JSON.stringify({error:err.message}))
    })
});

module.exports = router;