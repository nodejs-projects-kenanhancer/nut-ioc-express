const openApiValidator = require('express-openapi-validator');

module.exports.ServiceName = "";
module.exports.Service = async ({ expressServer, swaggerDefinitions, defaultRequestBuilderMiddleware, swaggerRequestBuilderMiddleware, expressRouteMiddleware, dependencyProvider }) => {

    const { app, express } = expressServer.configProvider;

    const createSwaggerServiceRoute = async ({ swaggerDefinition }) => {
        const router = express.Router();

        const openApiValidatorMiddleware = openApiValidator.middleware({
            apiSpec: swaggerDefinition,
            validateRequests: true, // (default)
            validateResponses: true, // false by default
        });

        router.all('*',
            swaggerRequestBuilderMiddleware,
            defaultRequestBuilderMiddleware,
            openApiValidatorMiddleware);

        const { servers: [{ url: basePath }], paths } = swaggerDefinition;

        for (const path in paths) {

            const methods = paths[path];

            for (const method in methods) {

                const { operationId } = methods[method];

                const actionFunc = await dependencyProvider(operationId);

                if (!actionFunc) {
                    console.error(`SWAGGER ERROR: Express Swagger Middleware couldn't find ${operationId} dependency in nut-ioc Dependency Injection Framework.`);
                    continue;
                    // throw new Error(`${serviceId} dependency couldn't be find in Dependency Injection Framework.`);
                }

                const expressPath = path.replace('}', '').replace('{', ':');

                router[method](expressPath,
                    async (req, res, next) => {
                        req.swaggerDefinition = swaggerDefinition;
                        req.swaggerPathDefinition = methods[method];

                        await expressRouteMiddleware.invoke(req, res, next);
                    },
                    async (req, res, next) => {
                        await actionFunc(req.args, req, res)
                            .then(response => {
                                res.status(200).send(response);
                            })
                            .catch(error => {
                                next(error);
                            });
                    });
            }
        }

        app.use(basePath, router);
    };

    for (const swaggerDefinition in swaggerDefinitions) {
        await createSwaggerServiceRoute({ swaggerDefinition: swaggerDefinitions[swaggerDefinition] });
    }

};
