// TODO: update callback and timer on message
const timerTrigger = (config) => {
    const {
        callback = () => { }, // avoid calling undefined as a function
        timer = 1000,   // default to 1s
        cancellationToken = () => false,
        // TODO: add live config update mode
    } = config;

    const timerTriggerCreator = () => {
        if (cancellationToken()) {
            return;
        }

        callback();
        setTimeout(
            timerTriggerCreator,
            timer
        );
    };
    timerTriggerCreator();
}

module.exports = timerTrigger;
