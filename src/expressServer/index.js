const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const helmet = require('helmet');

module.exports.ServiceName = "";
module.exports.Service = async ({ errorMiddleware, textBodyParserMiddleware, appEnv, UnauthorizedError, appLogger, swaggerDefinitions, swaggerDocumentValidator, expressRouteMiddleware }) => {

    const swaggers = { ...swaggerDefinitions };

    Object.entries(appEnv).filter(([key,]) => key.includes('ds.')).forEach(([key, value]) => {
        const [group, serviceName, fieldName] = key.split('.');

        swaggers[serviceName][fieldName] = value;
    });

    await swaggerDocumentValidator.validate({ swaggerDefinitions: swaggers });

    const app = express();

    const { PORT = 3000, HOST = "0.0.0.0", CORS_ORIGINS, REQUEST_BODY_SIZE = '100kb', HTTPS_PORT = 443, HTTPS_KEY_FILE = 'key.pem', HTTPS_CERT_FILE = 'cert.pem', HELMET_OPTIONS_FILE = '' } = appEnv;

    const HTTP_ENABLED = process.env.HTTP_ENABLED == undefined || process.env.HTTP_ENABLED === 'true';
    const HTTPS_ENABLED = process.env.HTTPS_ENABLED === 'true';

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

    if (HELMET_OPTIONS_FILE && fs.existsSync(HELMET_OPTIONS_FILE)) {
        const helmetOptions = JSON.parse(fs.readFileSync(HELMET_OPTIONS_FILE));
        app.use(helmet(helmetOptions));
    }

    const httpsOptions = {
        key: HTTPS_KEY_FILE && fs.existsSync(HTTPS_KEY_FILE) && fs.readFileSync(HTTPS_KEY_FILE),
        cert: HTTPS_CERT_FILE && fs.existsSync(HTTPS_CERT_FILE) && fs.readFileSync(HTTPS_CERT_FILE)
    }

    if (HTTPS_ENABLED && (!httpsOptions.key || !httpsOptions.cert)) {
        throw new Error('Please check, HTTPS key/cert files not found!')
    }

    return {
        configProvider: { app, express, PORT, expressRouteMiddleware },
        start: async (args) => {

            app.use(async (error, req, res, next) => await errorMiddleware(error, req, res, next));

            HTTP_ENABLED && http.createServer(app).listen({ port: PORT }, () => appLogger.info(`App listening HTTP requests on PORT ${PORT}!`));

            HTTPS_ENABLED && https.createServer(httpsOptions, app).listen({ port: HTTPS_PORT }, () => appLogger.info(`App listening HTTPS requests on PORT ${HTTPS_PORT}!`));

            appLogger.info(`Swagger Document links:${appEnv.ApiDocs.reduce((acc, cur) => `${acc}\n${cur}`, "")}`);

        }
    }
}