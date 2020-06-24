const { Observable } = require('rxjs');
const _ = require('lodash');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const connector = ({
    ajaxConfig,
    period = 0,
    comparer = (oldObj, newObj) =>  _.isEqual(oldObj, newObj),
    ajaxClient
}) => {
    const observable = new Observable(subscriber => {
        const task = (lastResponse) => {
            setTimeoutPromise(period)
                .then(() => ajaxClient(ajaxConfig))
                .then((newResponse) => {
                    const areSameResponse = comparer(lastResponse, newResponse);
                    if (!areSameResponse) {
                        subscriber.next(newResponse);
                    }
                    task(newResponse);
                })
        };

        task();
    });

    return observable;
}

module.exports = connector;