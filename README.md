# nut-ioc-express
nut-ioc-express uses Express Framework to host endpoints in OpenAPI or Swagger document.

[nut-ioc-express](https://www.npmjs.com/package/nut-ioc-express) is used by [nut-ioc](https://www.npmjs.com/package/nut-ioc) npm package.

Environment Variables with default values


## Environment Variables with default values

- HOST=0.0.0.0
- PORT=3000
- APP_LOGGER=consoleLogger
- CORS_ORIGINS=*
- REQUEST_BUILDER=swaggerV3RequestBuilder
- OPEN_API_UI_BASE_PATH=/api-docs
- REQUEST_BODY_SIZE=100kb
- HTTP_ENABLED=true
- HTTPS_ENABLED=false
- HTTPS_PORT=443
- HTTPS_KEY_FILE=key.pem
- HTTPS_CERT_FILE=cert.pem
## Example

Auth0 usage is in the following example, notice that `expressRouteMiddleware.use` is called for every route invocation so that we can add new middleware for some paths.

```javascript
require('dotenv').config();

const jwt = require('express-jwt');

const jwksRsa = require('jwks-rsa');

const { getNutIocContainer } = require('./nut-ioc-container-configurations');

const nutIocContainer = getNutIocContainer();

const { AUTHO_DOMAIN, AUTHO_AUDIENCE } = process.env;

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTHO_DOMAIN}.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: AUTHO_AUDIENCE,
    issuer: AUTHO_DOMAIN,
    algorithms: ['RS256']
});

const mainAsync = async () => {
    const { expressServer } = await nutIocContainer.build();

    const { expressRouteMiddleware } = await expressServer.configProvider;

    expressRouteMiddleware.use((req, res, next) => {

        res.set('Cache-Control', 'no-store, max-age=0');

        const { security } = req.swaggerPathDefinition;

        if (security && security.length > 0) {
            checkJwt(req, res, next);
        }
    });

    await expressServer.start({});
};

mainAsync();
```