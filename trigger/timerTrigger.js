const { workerData } = require('worker_threads');

// TODO: update callback and timer on message
module.exports = () => {
    const timerTriggerCreator = () => {
        const {
            callback = () => { }, // avoid calling undefined as a function
            timer = 1000,   // default to 1s
        } = workerData;

        callback();
        setTimeout(
            timerTriggerCreator,
            timer
        );
    };
    timerTriggerCreator();
}