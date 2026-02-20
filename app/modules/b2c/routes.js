const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('b2c')

const ttp = require('./ttp/routes.js')

module.exports = router;
