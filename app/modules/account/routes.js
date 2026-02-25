const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/account')

router.post('/manage/team/change-account-role', function (req, res, next) {
    if (req.body.changedAccountRole == 'user') {
        res.redirect('/account/manage/team/change-account-role/service-roles-lost?userType=' + req.query.userType);
    }
    else {
        res.redirect('/account/manage/team/change-account-role/check-your-answers?userType=' + req.query.userType);
    }
});

router.post('/manage/team/change-account-role/service-roles-lost', function (req, res, next) {
    if (req.body.confirmRemoval == 'yes') {
        res.redirect('/account/manage/team/change-account-role/check-your-answers?userType=' + req.query.userType);
    }
    else {
        res.redirect('/account/manage/team/change-account-role/change-cancelled?userType=' + req.query.userType);
    }
});

module.exports = router;
