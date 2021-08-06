let _middleware = undefined;

module.exports.Service = () => ({
    use: (middleware) => {
        _middleware = middleware;
    },
    invoke: (req, res, next) => {
        _middleware && _middleware(req, res, next) || next();
    }
});
