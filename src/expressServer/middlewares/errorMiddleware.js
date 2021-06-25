module.exports.ServiceName = '';
module.exports.Service = () => async (error, req, res) => {

    res.status(error.status || 500).json({
        code: error.code,
        message: error.message,
        status: error.status,
        errors: error.errors
    });

}
