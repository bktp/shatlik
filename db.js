const pgp = require('pg-promise')()
const db = pgp(process.env.DB_RUL)

module.exports = db
