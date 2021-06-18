module.exports.Service = () =>
    function ({ code, message, statusCode }) {

        this.name = "BaseError";
        this.code = code;
        this.message = (message || "");
        this.statusCode = statusCode;

        var error = new Error(this.message);
        error.name = this.name;
        this.stack = error.stack;
    };
