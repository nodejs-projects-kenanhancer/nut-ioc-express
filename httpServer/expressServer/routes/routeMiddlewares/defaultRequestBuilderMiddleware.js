module.exports.ServiceName = ""; 
module.exports.Service = ({ utility: { stringHelpers } }) =>
    async (req, res, next) => {

        const { headers } = req;

        const newHeaders = {};

        for (const header in headers) {
            const capitalizedHeader = stringHelpers.capitalize(header);
            newHeaders[capitalizedHeader] = headers[header];
        }

        req.args = { ...req.args, ...newHeaders };

        await next();
    };
