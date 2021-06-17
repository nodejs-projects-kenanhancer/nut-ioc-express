module.exports = {
    ServiceName: "",
    Service: ({ dependencyProvider, appEnv, swaggerDocumentValidator, swaggerDefinitions }) => ({
        start: async (args) => {

            const swaggers = { ...swaggerDefinitions };

            Object.entries(appEnv).filter(([key,]) => key.includes('ds.')).forEach(([key, value]) => {
                const [group, serviceName, fieldName] = key.split('.');

                swaggers[serviceName][fieldName] = value;
            });

            const httpServer = await dependencyProvider(appEnv["HTTP_SERVER"]);

            await swaggerDocumentValidator.validate({ swaggerDefinitions: swaggers });

            await httpServer.start(args);
        }
    })
}
