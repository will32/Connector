// const assert = require('assert');
const connector = require('./connector');

// describe('connector should pipe ajax response in interval', () => {
    const connectorObservable = connector({
        ajaxClient: () => Promise.resolve(Date.now()),
        ajaxConfig: {},
        period: 1 * 1000
    });

    connectorObservable.subscribe(console.log);
// })