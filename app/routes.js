//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const b2c = require('./modules/b2c/routes.js')

const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

    // Add your routes here
    router.use((req, res, next) => {
        if (!!req.query.amr) {
            req.session.data.auth = req.session.data.auth || {};
            req.session.data.auth.amr = amr;
        }

        next();
    });

    // Local auth
    router.post('/account/thirdParty/localauth/sign-in-local-auth', function(request, response) {
        var authsignin = request.session.data['authsignin'];
        if (authsignin == "government-gateway") {
            response.redirect("/gov-gateway/sign-in");
        } else {
            response.redirect("/account/thirdParty/localauth/email");
        }
    });
