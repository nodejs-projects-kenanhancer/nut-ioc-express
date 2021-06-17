module.exports.ServiceName = '';
module.exports.Service = () => async (error, req, res) => {

    res.status(error.status || 500).json({
        message: error.message,
        errors: error.errors,
    });

    // res.statusCode = error.statusCode || 500;
    // if (error.stack)
    //     delete error.stack;

    // res.send(error || 'ERROR');

};