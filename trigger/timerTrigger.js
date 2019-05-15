const { workerData, isMainThread } = require('worker_threads');

// TODO: update callback and timer on message
const timerTrigger = (config) => {
    const timerTriggerCreator = () => {
        const {
            callback = () => { }, // avoid calling undefined as a function
            timer = 1000,   // default to 1s
        } = config;

        callback();
        setTimeout(
            timerTriggerCreator,
            timer
        );
    };
    timerTriggerCreator();
}

if (!isMainThread) {
    const { timer } = workerData;
    const callback = eval(workerData.callback);
    timerTrigger({
        timer,
        callback
    });
}

module.exports = timerTrigger;
