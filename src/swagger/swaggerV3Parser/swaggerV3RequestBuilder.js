module.exports.ServiceName = "";
module.exports.Service = ({ swaggerV3RequestHeaderValidator, utility: { stringHelpers: { capitalize } }, clientErrors: { SwaggerError } }) =>
    async ({ swaggerDefinitions, url, baseUrl, headers, method, body }) => {

        const methodLowerCase = method.toLowerCase();

        const queryStringArray = url.split('?');

        const pathUrl = queryStringArray[0];

        const splittedPathUrl = pathUrl.split('/').slice(1);



        const swaggerDefinition = swaggerDefinitions && Object.values(swaggerDefinitions).find(def => def.servers[0].url === baseUrl) || {};

        if (!swaggerDefinition) {
            throw new SwaggerError({ message: `Bad request:: Swagger ${baseUrl} base url not found in Swagger definiton.` });
        }

        const { paths: swagger_paths, components: { parameters: swagger_parameters, requestBodies } = {} } = swaggerDefinition;

        const [swagger_path, swagger_pathMethods] = Object.entries(swagger_paths).find(([key]) => key === pathUrl || key.split('/').slice(1).every((item, index) => item.includes('{') || splittedPathUrl[index] === item)) || [];

        if (!swagger_path) {
            throw new SwaggerError({ message: `Bad request:: Swagger ${pathUrl} path not found in Swagger definition.` });
        }


        let queryParams, pathParams;

        if (queryStringArray.length === 2) {
            queryParams = new URLSearchParams(queryStringArray[1]);

            queryParams = Array.from(queryParams.entries()).reduce((acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }), {});
        }

        if (swagger_path.includes('{')) {
            pathParams = swagger_path.split('/').reduce((acc, cur, index) => {

                if (!cur.includes('{')) {
                    return acc;
                }

                return { ...acc, [cur.replace(/[{}]/g, '').toLowerCase()]: splittedPathUrl[index - 1] };
            }, {});
        }

        const [, swagger_pathMethod] = Object.entries(swagger_pathMethods).find(([key, value]) => key.toLowerCase() === methodLowerCase) || [];

        if (!swagger_pathMethod) {
            throw new SwaggerError({ message: `Bad request:: Swagger ${method} method not found in ${swagger_path} path in Swagger definition.` });
        }

        const args = { body };

        if (swagger_pathMethod.parameters) {
            for (const swagger_pathMethodParameter of swagger_pathMethod.parameters) {
                let pathMethodParameterName;
                let methodParameterObj;

                if (swagger_pathMethodParameter.hasOwnProperty('$ref')) {
                    pathMethodParameterName = Object.values(swagger_pathMethodParameter)[0];

                    const splitParam = pathMethodParameterName.split('/');

                    const methodParameterName = splitParam && splitParam[splitParam.length - 1];

                    pathMethodParameterName = methodParameterName;

                    methodParameterObj = swagger_parameters[pathMethodParameterName] || requestBodies;
                } else {
                    pathMethodParameterName = swagger_pathMethodParameter.name;

                    methodParameterObj = swagger_pathMethodParameter;
                }

                const paramValue = await swaggerV3RequestHeaderValidator.validate({ headers, queryParams, pathParams, body, swagger_pathMethodParameter: methodParameterObj });

                pathMethodParameterName = await capitalize(pathMethodParameterName);

                args[pathMethodParameterName] = paramValue;
            }
        }

        return args;
    };