var express = require('express');
var router = express.Router();

let db = require('../db')

/* GET home page. */
router.get('/', (req, res) => {
    const offset = req.query.offset || 0
    const count = req.query.count || 5
    db
        .any('SELECT * FROM events ORDER BY id DESC LIMIT ${count} OFFSET ${offset}', { count, offset })
        .then(data => res.json(data))
        .catch(err => res.json({ error: err.message }))
})

router.get('/count', (req, res) => {
    db.one('SELECT COUNT(*) FROM events')
        .then(data => res.json(data))
        .catch(err => res.json({ error: err.message }))
})

router.get('/all', (req, res) => {
    db
        .any('SELECT * FROM events ORDER BY id DESC')
        .then(data => res.json(data))
        .catch(err => res.json({ error: err.message }))
})

router.post('/', (req, res) => {
    let id
    db
        .tx(tx => {
            tx.one('INSERT INTO events(title, main_image, small_text, date) ' +
                'VALUES(${title}, ${main_image}, ${small_text}, ${date}) RETURNING id', req.body)
                .then(event => {
                    id = event.id
                    return tx.batch([
                        ...req.body.images.map(image => tx.none('INSERT INTO event_images VALUES(${id}, ${level}, ${image})', { id: event.id, ...image })),
                        ...req.body.blocks.map(block => tx.none('INSERT INTO event_blocks VALUES(${id}, ${level}, ${text})', { id: event.id, ...block }))
                    ])
                })
        })
        .then(() => res.json({ id: id }))
        .catch(err => res.json({ error: err.message }))
})

router.get('/:id', (req, res) => {
    let id = Number(req.params.id);
    db
        .tx(tx => {
            return tx
                .batch([
                    tx.one('SELECT * FROM events WHERE id=$1', id),
                    tx.any('SELECT * FROM event_blocks WHERE event_id=$1', id),
                    tx.any('SELECT * FROM event_images WHERE event_id=$1', id)
                ])
        })
        .then(data => {
            let result = {}
            result = Object.assign({}, result, data[0])
            result.blocks = []
            data[1].map(block => {
                result.blocks[block.level] = { text: block.text }
                result.blocks[block.level].images = []
            })
            data[2].map(image => result.blocks[image.level].images.push({ src: image.image }))
            res.json(result)
        })
        .catch(err => res.json({ error: err.message }))
})

router.put('/:id', (req, res) => {
    let id = Number(req.params.id);
    db
        .tx(tx => {
            return tx
                .batch([
                    tx.none('UPDATE events SET title=${title}, main_image=${main_image}, small_text=${small_text} WHERE id=${id}',
                        { id: id, ...req.body }),
                    tx.none('DELETE FROM event_images WHERE event_id=$1', id),
                    ...req.body.images.map(image => tx.none('INSERT INTO event_images VALUES(${id}, ${level}, ${image})',
                        { id: id, ...image })),
                    tx.none('DELETE FROM event_blocks WHERE event_id=$1', id),
                    ...req.body.blocks.map(block => tx.none('INSERT INTO event_blocks VALUES(${id}, ${level}, ${text})',
                        { id: id, ...block }))
                ])
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.json({ error: err.message }))
})

router.delete('/:id', (req, res) => {
    let id = Number(req.params.id);
    db
        .none('DELETE FROM events WHERE id=$1', id)
        .then(() => res.sendStatus(200))
        .catch(err => res.json({ error: err.message }))
})

module.exports = router;