const _ = require('lodash');
const axios = require('axios').default;
const connector = require('./connector');


const main = ({
    ajaxConfig,
    period = 1000,
    comparer = (oldObj, newObj) => _.isEqual(_.get(oldObj, 'data'), _.get(newObj, 'data')),
    ajaxClient = axios,
    canceler = () => false
}) => connector({
    ajaxConfig,
    period,
    comparer,
    ajaxClient,
    canceler
});

module.exports = main;