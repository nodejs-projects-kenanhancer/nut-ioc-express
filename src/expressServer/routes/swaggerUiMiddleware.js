const swaggerUiMiddleware = require('swagger-ui-express');

module.exports.ServiceName = "";
module.exports.Service = async ({ expressServer, appEnv, swaggerDefinitions }) => {

    const { app, express } = expressServer.configProvider;

    appEnv.ApiDocs = [];

    const { PORT } = appEnv;

    const options = {
        explorer: true
    };

    const router = express.Router();

    const swaggers = { ...swaggerDefinitions };

    for (const swaggerDefinitionName in swaggers) {
        const swaggerDefinition = swaggers[swaggerDefinitionName]
        const { servers: [{ url: basePath }] } = swaggerDefinition;

        const host = `localhost:${PORT}`;

        router.use(basePath, swaggerUiMiddleware.serve);

        router.get(basePath, function (req, res) {
            const html = swaggerUiMiddleware.generateHTML(swaggerDefinition, options);

            res.send(html);
        });

        appEnv.ApiDocs.push(`http://${host}/api-docs${basePath}`);

    }

    app.use("/api-docs", router);

};
