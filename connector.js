const { Observable, isObservable, from } = require('rxjs');
const { finalize, map, catchError } = require('rxjs/operators');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const connector = ({
    ajaxConfig,
    period,
    comparer,
    ajaxClient,
    canceler
}) => {
    const observable = new Observable(subscriber => {
        const task = (lastResponse) => {
            let ajaxObservable = ajaxClient(ajaxConfig);
            if (!isObservable(ajaxObservable)) {
                ajaxObservable = from(ajaxObservable);
            }

            setTimeoutPromise(period)
                .then(() => {
                    let response = lastResponse;
                    ajaxObservable
                        .pipe(
                            map(newResponse => {
                                const areSameResponse = comparer(lastResponse, newResponse);
                                if (!areSameResponse) {
                                    subscriber.next(newResponse);
                                    response = newResponse;
                                }
                            }),
                            catchError(subscriber.error),
                            finalize(() => {
                                if (!canceler()) {
                                    task(response);
                                } else {
                                    subscriber.complete()
                                }
                            })
                        )
                        .subscribe();
                });
        };

        task();
    });

    return observable;
}

module.exports = connector;