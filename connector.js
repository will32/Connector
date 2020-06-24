const { Observable, isObservable, from } = require('rxjs');
const _ = require('lodash');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const connector = ({
    ajaxConfig,
    period = 0,
    comparer = (oldObj, newObj) => _.isEqual(oldObj, newObj),
    ajaxClient
}) => {
    const observable = new Observable(subscriber => {
        const task = (lastResponse) => {
            let ajaxObservable = ajaxClient(ajaxConfig);
            if (!isObservable(ajaxObservable)) {
                ajaxObservable = from(ajaxObservable);
            }

            setTimeoutPromise(period)
                .then(() => {
                    const ajaxSubscription = ajaxObservable.subscribe(
                        (newResponse) => {
                            const areSameResponse = comparer(lastResponse, newResponse);
                            if (!areSameResponse) {
                                subscriber.next(newResponse);
                            }
                            task(newResponse);
                        },
                        undefined,
                        () => ajaxSubscription.unsubscribe())
                });
        };

        task();
    });

    return observable;
}

module.exports = connector;