const crypto = require('crypto')

function isAuth(password) {
    (crypto.createHash('sha256').update(password).digest('base64') == 'wSvJgmeUZCyX1WrVSIykOjbuBp3rf72B/eJt32LyLSQ=') ? true : false
}

module.exports = isAuth