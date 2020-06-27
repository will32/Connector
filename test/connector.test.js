const _ = require('lodash');
const assert = require('assert');
const connector = require('../connector');
const { it, describe, beforeEach } = require('mocha');


describe("connector", () => {
    let canceler;

    beforeEach(() => {
        canceler = (() => {
            let data = false;
            return (value) => {
                if (value !== undefined) {
                    data = value;
                }
                return data;
            }
        })();
    })
    it('should push ajax response', (done) => {
        const data = { data: 1 };
        const ajaxClient = Promise.resolve(data);
        const connectorObservable = connector({
            ajaxClient: () => ajaxClient,
            ajaxConfig: {},
            period: 1,
            canceler
        });

        connectorObservable
            .subscribe(newData => {
                assert.equal(newData, data);
                canceler(true);
            }, done, done);
    });

    it('should push ajax response in interval', done => {
        let counter = 0;
        const response = { data: counter };
        const ajaxClient = () => {
            counter += 1;
            response.data += 1;
            return Promise.resolve(_.cloneDeep(response));
        };

        const observable = connector({
            ajaxClient,
            ajaxConfig: {},
            period: 5,
            canceler
        });
        observable.subscribe(response => {
            assert.equal(response.data, counter);
            if (counter >= 7) {
                canceler(true);
            }
        }, done, done);
    })

    
    it('should not push same ajax response', done => {
        const response = { data: 1 };
        const ajaxClient = () => {
            return Promise.resolve(_.cloneDeep(response));
        };

        const observable = connector({
            ajaxClient,
            ajaxConfig: {},
            period: 5,
            canceler
        });
        let counter = 0;
        const subscription = observable.subscribe(() => {
            counter += 1;
        }, done, () => done(new Error('Unexpected finish')));
        setTimeout(() => {
            assert.equal(counter, 1);
            subscription.unsubscribe();
            canceler(true);
            done();
        }, 1000);
    })
})