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

        const { data } = req.session;
        let { auth, defaults } = data;

        if (typeof defaults === 'undefined') {
            next();
            return;
        }

        let changed = false;

        const amr = data.amr || 'scp';
        const userType = data.userType || 'user';
        const invitation = data.invitation || 'false';

        // rebuild auth if not in session or we're changing amr
        if (!auth || (amr != auth.amr)) {
            auth = data.auth = {
                amr
            };
            data.amr = auth.amr;

            changed = true;
        }

        // rebuild user part of auth if not in session or we're changing user type
        if (!auth.user || (userType != auth.user.type)) {
            let amrDefaults = defaults[auth.amr] || {};

            auth.user = Object.assign({type: userType}, amrDefaults[userType] || amrDefaults['user']);

            data.userType = auth.user.type;

            changed = true;
        }

        // rebuild invitation part of auth if we're changing invitation type
        let isInvitation = invitation != 'false';
        if (isInvitation != auth.isInvitation) {
            let amrDefaults = defaults[auth.amr] || {};

            auth.isInvitation = isInvitation;
            auth.service = Object.assign({}, amrDefaults.service);
            auth.organisation = Object.assign({}, amrDefaults.organisation);
            auth.isRegistration = invitation == 'new';

            data.invitation = invitation;

            changed = true;
        }

        // HACK: session changes in middleware don't always affect nunjucks
        if (changed) {
            delete req.query.amr;
            delete req.query.userType;
            delete req.query.invitation;

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
