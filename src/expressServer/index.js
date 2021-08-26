const express = require('express');
const cors = require('cors');

module.exports.ServiceName = "";
module.exports.Service = async ({ errorMiddleware, textBodyParserMiddleware, appEnv, UnauthorizedError, appLogger, swaggerDefinitions, swaggerDocumentValidator, expressRouteMiddleware }) => {

    const swaggers = { ...swaggerDefinitions };

    Object.entries(appEnv).filter(([key,]) => key.includes('ds.')).forEach(([key, value]) => {
        const [group, serviceName, fieldName] = key.split('.');

        swaggers[serviceName][fieldName] = value;
    });

    await swaggerDocumentValidator.validate({ swaggerDefinitions: swaggers });

    const app = express();

    const { PORT = 3000, HOST = "0.0.0.0", CORS_ORIGINS, REQUEST_BODY_SIZE = '100kb' } = appEnv;
    const allowedOrigins = CORS_ORIGINS && CORS_ORIGINS.split(',');

    app.use(express.json({ limit: REQUEST_BODY_SIZE })); // using bodyParser to parse JSON bodies into JS objects

    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.use(textBodyParserMiddleware); // for parsing text/* like text/plain, text/html etc.

    app.use(
        cors({
            origin: (origin, callback) => {
                if (origin && (!allowedOrigins || !allowedOrigins.some(key => key === "*" || key === origin))) {
                    var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                    return callback(new UnauthorizedError(msg), false);
                }
                return callback(null, true);
            },
        })
    );

    // const httpServer = http.createServer(app);
    // httpServer.listen(process.env.HTTPPORT || 8080, function () {
    //     const PORT = httpServer.address().PORT;
    //     console.log('HTTP server running on PORT', PORT);
    // });

    // const httpsOptions = {
    //     key: fs.readFileSync('my-ssl-key'),
    //     cert: fs.readFileSync('my-ssl-cert')
    // };
    // const httpsServer = https.createServer(httpsOptions, app);
    // httpsServer.listen(process.env.HTTPSPORT || 8081, function () {
    //     const PORT = httpsServer.address().PORT;
    //     console.log('HTTPS server running on PORT', PORT);
    // });
    return {
        configProvider: { app, express, PORT, expressRouteMiddleware },
        start: async (args) => {

            app.use(async (error, req, res, next) => await errorMiddleware(error, req, res, next));

            app.listen(PORT, HOST, () => appLogger.info(`App listening on PORT ${PORT}!`));

            appLogger.info(`Swagger Document links:${appEnv.ApiDocs.reduce((acc, cur) => `${acc}\n${cur}`, "")}`);

        }
    };
};
