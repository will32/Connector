const axios = require('axios').default;
const connector = require('./connector');

const main = (config) => connector({
    ...config,
    ajaxClient: axios
});

module.exports = main;