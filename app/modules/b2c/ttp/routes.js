const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/b2c/thirdParty')

function getUserData(userType, defaults) {
    switch (userType) {
        case 'ceo': return defaults.ttp.ceo;
        case 'admin': return defaults.ttp.admin;
        case 'user': return defaults.ttp.user;
        default: return null;
    }
}

router.use(function (req, res, next) {

    const { auth, defaults } = req.session.data;

    if (!auth || !!req.query.userType) {
        var userData = getUserData(req.query.userType, defaults);
        var userType = req.query.userType || 'user';

        req.session.data.auth = {
            isInvitation: !!userData,
            amr: 'ttp',
            user: Object.assign({ type: userType }, userData || defaults.ttp.user),
            service: Object.assign({}, defaults.ttp.service),
            organisation: Object.assign({}, defaults.ttp.organisation)
        }

        if (req.session.data.auth.isInvitation) {
            req.session.data.userType = 'TPmemberInvite';
        }
    }

    next();
});

router.post('/', function (req, res, next) {

    const { auth } = req.session.data;

    if (req.body.email) {
        auth.user.email = req.body.email;
    }

    // for reg configuration
    if (auth.user.type == 'ThirdPartyCEO') {
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
    const { auth } = req.session.data;

    let queryString = '';

    if (auth.isInvitation) {
        if (auth.user.type == 'ThirdPartyCEO') {
            res.redirect('/b2c/thirdParty/confirm-details');
        }
        else {
            res.redirect('/register/personal-name')
        }
        return;
    }

    if (auth.user.type == 'ThirdPartyCEO') {
        queryString = "?defaultThirdPartyCEORegistered=True";
    }

    res.redirect(`/account/thirdParty/confirmation${queryString}`)
});

module.exports = router
