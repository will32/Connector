const { Worker } = require('worker_threads')

const triggerTypes = {
    OFF: 0,
    TIMER: 1,
    API: 2
};


/**
 * call the callback when the trigger is satisfied
 * trigger will be tested towards only if triggerType contains such trigger and triggers contain corresponding properties
 * @param triggerType a enum that specific activated triggers, use bitwise operation (&) for multiple triggers
 */
const trigger = (config) => {
    const { triggerType, callback, timer } = config;

    // if trigger is off, do nothing
    if ((triggerType | 0) === 0) {
        return;
    }

    // test trigger contains timer
    if ((triggerType & triggerTypes.TIMER) === triggerType.TIMER) {
        new Worker(
            './timerTrigger.js', {
                workerData: {
                    callback,
                    timer
                }
            }
        );
    }
}

module.exports = trigger;