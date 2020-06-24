const assert = require('assert');
const connector = require('../connector');
const { it, describe } = require('mocha');

describe("connector", () => {
    it('should pipe ajax response', done => {
        const data = {a: 1};
        const connectorObservable = connector({
            ajaxClient: () => Promise.resolve(data),
            ajaxConfig: {},
            period: 1 * 1000
        });
    
        const subscription = connectorObservable.subscribe(newData => {
            assert.equal(newData, data);
            subscription.unsubscribe();
            done();
        });
    });
})