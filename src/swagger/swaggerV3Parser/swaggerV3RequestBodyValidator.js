module.exports.ServiceName = "";
module.exports.Service = () => ({
    validate: ({ body, swaggerBodyParam, requestBodies }) => {

        if (swaggerBodyParam.hasOwnProperty('$ref')) {

            const splitParam = Object.values(swaggerBodyParam)[0]?.split('/');
            const schemaName = splitParam && splitParam[splitParam.length - 1];
            const { content, required } = requestBodies[schemaName];
            if (required && !body) {
                throw new SwaggerError({ message: `SWAGGER ERROR: Body is required` });
            }
        }

        return body;
    }
});