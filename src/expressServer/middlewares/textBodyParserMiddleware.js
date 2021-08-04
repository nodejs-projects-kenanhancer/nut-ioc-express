module.exports.ServiceName = '';
module.exports.Service = () => async (req, res, next) => {

    if (req.headers['content-type'] === 'text/plain') {
        req.setEncoding('utf8');
        req.body = '';
        req.on('data', function (chunk) {
            req.body += chunk;
        });
        req.on('end', next);
    } else {
        next();
    }

}
