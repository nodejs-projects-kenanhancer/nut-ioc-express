module.exports.ServiceName = ""; 
module.exports.Service = ({ swaggerV2FieldValidators, clientErrors: { SwaggerError } }) => ({
    validate: ({ headers, queryParams, pathParams, body, swagger_pathMethodParameter }) => {

        const { name, lowerCaseName = name && name.toLocaleLowerCase(), in: parameterLocation, required, type, minLength, maxLength, enum: enumValue, pattern: regex, schema } = swagger_pathMethodParameter;

        if (!name || name === "") {
            throw new SwaggerError({ message: 'SWAGGER ERROR: Header name value cannot be empty, null or undefined.' });
        }

        let value;

        if (parameterLocation === 'query') {

            if (required && !([lowerCaseName] in queryParams)) {
                throw new SwaggerError({ message: `SWAGGER ERROR: ${lowerCaseName} query string field should be in url` });
            }

            value = queryParams && queryParams[lowerCaseName];
        }
        else if (parameterLocation === 'header') {

            if (required && !([lowerCaseName] in headers)) {
                throw new SwaggerError({ message: `SWAGGER ERROR: ${lowerCaseName} header is required` });
            }

            value = headers[lowerCaseName];
        }
        else if (parameterLocation === 'path') {

            if (required && !([lowerCaseName] in pathParams)) {
                throw new SwaggerError({ message: `SWAGGER ERROR: ${lowerCaseName} path field should be in url` });
            }

            value = pathParams[lowerCaseName];
        }
        else if (parameterLocation === 'body') {

            if (required && !body) {
                throw new SwaggerError({ message: 'SWAGGER ERROR: body is required' });
            }

            value = body;
        }

        Object.values(swaggerV2FieldValidators).forEach(fieldValidator => fieldValidator({ name, value, type, minLength, maxLength, enumValue, regex }));

        return value;
    }
});