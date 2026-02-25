const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/b2c/thirdParty')
const url = require('url')

router.use(function (req, res, next) {

    const { data } = req.session;
    const { auth, defaults } = data;

    if (auth.amr != 'ttp' && data.amr != 'ttp') {
        req.query.amr = 'ttp';
        res.redirect(url.format({
            pathname: req.baseUrl + req.path,
            query: req.query
        }));
        return;
    }

    next();
});

router.post('/', function (req, res, next) {

    const { auth, accountRoles } = req.session.data;

    if (req.body.email) {
        auth.user.email = req.body.email;
    }

    // for reg configuration
    if (auth.user.accountRole == accountRoles.owner.name) {
        req.session.data.regThirdPartyCEOEmail = auth.user.email;
    }
    else {
        req.session.data.regTeamTPemail = auth.user.email;
    }

    res.redirect('/b2c/thirdParty/enter-code');
});

router.get('/enter-code', function (req, res, next) {

    req.session.data.auth.resendCode = !!req.query.resendCode;
    next();
});

router.post('/enter-code', function (req, res, next) {
    const { auth, accountRoles } = req.session.data;

    if (!auth.isInvitation) {
        res.redirect('/account');
        return;
    }

    if (!auth.isRegistration || auth.user.accountRole == accountRoles.owner.name) {
        res.redirect('/b2c/thirdParty/confirm-details');
        return;
    }

    res.redirect('/register/personal-name');
});

module.exports = router
