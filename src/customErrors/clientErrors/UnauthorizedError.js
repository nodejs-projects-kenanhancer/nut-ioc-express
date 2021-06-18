module.exports.Service = ({ BaseError }) =>
    function ({ code, message }) {

        Object.assign(this, new BaseError({ code, message, statusCode: 401 }));

        this.name = "UnauthorizedError";
    };
