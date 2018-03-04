var express = require('express');
var router = express.Router();

let db = require('../db')

/* GET home page. */
router.get('/', (req, res) => {
    const offset = req.query.offset || 0
    const count = req.query.count || 5
    db.any('SELECT * FROM events ORDER BY id DESC LIMIT ${count} OFFSET ${offset}', {
            count,
            offset
        })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            res.json({
                error: err.message
            })
        })
})

router.post('/', (req, res) => {
    let insertID
    db.one('SELECT id FROM events ORDER BY id DESC LIMIT 1')
        .then(id => {
            console.dir(id)
            insertID = id.id + 1
            db.tx(t => {
                    const q1 = t.none('INSERT INTO events(id, title, main_image, small_text, date) VALUES($1, ${title}, ${main_image}, ${small_text}, ${date})', insertID, req.body)
                    const q2 = req.body.images.map(image => {
                        return t.none('INSERT INTO event_images VALUES($1, ${level}, ${image})', insertID, image)
                    })
                    const q3 = req.body.blocks.map(block => {
                        return t.none('INSERT INTO event_blocks VALUES($1, ${level}, ${text})', insertID, block)
                    })
                    return t.batch([q1, q2, q3])
                })
                .then(() => res.send())
                .catch(err => res.json({
                    error: err.message
                }))
        }).catch(err => res.json({
            error: err.message
        }))
})

router.get('/:id', (req, res) => {
    let result = {
        galleries: {}
    }
    db.one('SELECT * FROM events WHERE id=$1', req.params.id)
        .then((event) => {
            Object.assign(result, event)
            db.any('SELECT * FROM event_images WHERE event_id=$1', req.params.id)
                .then((event_images) => {
                    for (let image of event_images) {
                        if (!result.galleries[image.level]) {
                            result.galleries[image.level] = []
                        }
                        result.galleries[image.level].push(image.image)
                    }
                    res.header()
                    res.send(JSON.stringify(result))
                })
                .catch(err => res.json({
                    error: err.message
                }))
        })
        .catch((err) => {
            res.send(JSON.stringify({
                error: err.message
            }))
        })
});

router.put('/:id', (req, res) => {
    db.tx(t => {
            const q1 = db.query('UPDATE events SET title=${title}, main_image=${main_image}, small_text=${small_text}, date=${date} WHERE id=$1', req.params.id, req.body)
            const q2 = db.query('DELETE FROM event_images WHERE id=$1', req.params.id)
            const q3 = req.body.images.map(image => {
                return t.none('INSERT INTO event_images VALUES($1, ${level}, ${image})', req.params.id, image)
            })
            const q4 = db.query('DELETE FROM event_blocks WHERE id=$1', req.params.id)
            const q5 = req.body.blocks.map(block => {
                return t.none('INSERT INTO event_blocks VALUES($1, ${level}, ${text})', req.params.id, block)
            })
            return t.batch([q1, q2, q3, q4, q5])
        })
        .then(data => res.json(data))
        .catch(err => res.json({
            err: err.message
        }))
})

router.delete('/:id', (req, res) => {
    db.none('DELETE FROM events WHERE id=$1', req.params.id)
        .then(() => res.send())
        .catch(err => res.json({
            error: err.message
        }))
})

module.exports = router;