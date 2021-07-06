const { capitalize } = require('nut-ioc/helpers/string-helper');

module.exports.Service = () => ({
    capitalize: (text) => capitalize(text),
    capitalizeFirst: (text) => text && text.charAt(0).toLocaleUpperCase() + text.slice(1)
});
