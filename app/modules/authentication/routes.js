const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/authentication')

const ttp = require('./ttp/routes.js')

router.post('/amr-selection', function (req, res, next) {
    if (req.body.amrSelection == 'ttp') {
        res.redirect('/authentication/ttp');
    }
    else if (req.body.amrSelection == 'one') {
        res.redirect('/authentication/one');
    }
    else {
        res.redirect('/authentication/scp/sign-in');
    }
});

module.exports = router;
