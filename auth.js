const crypto = require('crypto')


const auth = {
    isAuth(password) {
        let hash = crypto.createHash('sha256').update(password).digest('base64')
        if (hash == 'wSvJgmeUZCyX1WrVSIykOjbuBp3rf72B/eJt32LyLSQ=') return true
        else return false
    }
}

module.exports = auth