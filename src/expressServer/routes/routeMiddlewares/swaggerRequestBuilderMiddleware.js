module.exports.ServiceName = "";
module.exports.Service = async ({ swaggerDefinitions, dependencyProvider, appEnv: { REQUEST_BUILDER = 'swaggerV3RequestBuilder' } }) => {

    const swaggerRequestHeaderPrettifier = await dependencyProvider(REQUEST_BUILDER);

    return async (req, res, next) => {

        try {
            const args = await swaggerRequestHeaderPrettifier({ swaggerDefinitions, ...req });

            req.args = { ...req.args, ...args };

            await next();

        } catch (err) {
            await next(err);
        }

    };
};