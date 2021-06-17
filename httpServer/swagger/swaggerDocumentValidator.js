const swaggerParser = require("swagger-parser");

module.exports.ServiceName = ""; 
module.exports.Service = ({ clientErrors: { SwaggerError }, appLogger }) =>
    ({
        validate: async ({ swaggerDefinitions }) => {

            for (const [key, def] of Object.entries(swaggerDefinitions)) {
                const newDef = JSON.parse(JSON.stringify(def));
                delete newDef.__metadata__;

                await swaggerParser.validate(newDef, (err, api) => {
                    if (err) {
                        appLogger.error('Swagger is invalid.', err.toString());
                        throw new SwaggerError({ message: 'SWAGGER ERROR: Not a valid swagger  ' + err.toString() });
                    } else {
                        appLogger.info(`Swagger is validated. API name: ${api.info.title}, Version: ${api.info.version}`);
                    }
                });
            }

        }
    });
