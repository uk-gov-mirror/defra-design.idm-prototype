//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const url = require('url')

const b2c = require('./modules/b2c/routes.js')

const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

    // Add your routes here
    router.use((req, res, next) => {

        let changed = false;
        let { auth, defaults } = req.session.data;

        let amr = req.query.amr;
        let amrDefaults = null;

        // figure out if we're changing AMR
        if (!auth || (!!amr && amr != auth.amr)) {
            amr = req.query.amr || 'scp';
            amrDefaults = defaults[amr];
        }

        // if we're changing AMR then set up new auth session
        if (!!amrDefaults) {
            auth = req.session.data.auth = {
                amr: amr,
                service: Object.assign({}, amrDefaults.service),
                organisation: Object.assign({}, amrDefaults.organisation)
            };

            delete req.query.amr;
            changed = true;
        }

        // if we just set up new auth session or are changing user
        if (!auth.user || (!!req.query.userType && req.query.userType != auth.user.type)) {
            let userType = req.query.userType || 'user';

            amrDefaults = defaults[auth.amr];
            auth.user = Object.assign({type: userType}, amrDefaults[userType] || amrDefaults['user']);

            delete req.query.userType;
            changed = true;
        }

        if (!!req.query.invitation) {
            auth.isInvitation = req.query.invitation == 'true';

            delete req.query.invitation;
            changed = true;
        }

        if (changed) {
            // HACK: session changes in middleware don't always affect nunjucks
            res.redirect(url.format({
                pathname: req.baseUrl + req.path,
                query: req.query
            }));
            return;
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
