module.exports.ServiceName = ""; 
module.exports.Service = ({ utility: { stringHelpers: { capitalize } } }) =>
    async (req, res, next) => {

        const { headers } = req;

        const newHeaders = {};

        for (const header in headers) {
            const capitalizedHeader = await capitalize(header);
            newHeaders[capitalizedHeader] = headers[header];
        }

        req.args = { ...req.args, ...newHeaders };

        await next();
    };
