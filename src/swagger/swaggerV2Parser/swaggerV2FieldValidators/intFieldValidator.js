module.exports.ServiceName = "";
module.exports.Service = ({ appLogger }) =>
    ({ name, value, type, minLength, maxLength, enumValue, regex }) => {
        if (value && value !== '' && type === 'number' || type === 'integer') {

            appLogger.warn('SWAGGER WARNING: It is not implemented yet.');
        }
    };