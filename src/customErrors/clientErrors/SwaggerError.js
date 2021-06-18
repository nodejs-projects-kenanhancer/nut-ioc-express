module.exports.Service = ({ clientErrors: { BadRequestError } }) =>
    function ({ code, message }) {

        Object.assign(this, new BadRequestError({ code, message }));

        this.name = "SwaggerError";
    };
