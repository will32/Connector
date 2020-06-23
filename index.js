const { Observable } = require('rxjs');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const axios = require('axios').default;
const _ = require('lodash');


const connector = (config) => {
    const {
        axiosConfig,
        period = 0,
        comparer = (oldObj, newObj) =>  oldObj == newObj,
    } = config;

    if (_.isEmpty(axiosConfig)) {
        throw new Error("axiosConfig can't be empty");
    }

    const observable = Observable(subscriber => {
        const task = (lastResponse) => {
            setTimeoutPromise(period)
                .then(() => axios(axiosConfig))
                .then((newResponse) => {
                    const areSameResponse = comparer(lastResponse, newResponse);
                    if (!areSameResponse) {
                        subscriber.next(newResponse);
                    }
                    task(newResponse);
                })
        };

        task();
    })

    return observable;
}

module.exports = connector;