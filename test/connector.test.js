const assert = require('assert');
const connector = require('../connector');
const { it, describe, beforeEach } = require('mocha');
const { of, empty } = require('rxjs')
const { startWith, first } = require('rxjs/operators')
const { TestScheduler } = require('rxjs/testing')


describe("connector", () => {
    let scheduler = new TestScheduler(assert.equal);

    beforeEach(() => {
        scheduler = new TestScheduler(assert.equal);
    });

    it('should push ajax response', (done) => {
        const canceler = (() => {
            let data = false;
            return (value) => {
                if (value !== undefined) {
                    data = value;
                }
                return data;
            }
        })();
        const data = {data: 1};
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
                done();
            });
    });

    // it('should push ajax response in interval', () => {
    //     scheduler.run(({ expectObservable }) => {
    //         const responses = { a: 1, b: 2, c: 3 };
    //         const ajaxClient = () => {
    //             let data = 0;
    //             return Promise.resolve(data += 1);
    //         };
    //         const expectedMarble = 'abc|';

    //         const observable = connector({
    //             ajaxClient,
    //             ajaxConfig: {},
    //             period: 1 * 1000,
    //         });

    //         expectObservable(observable, '--- !').toBe('123');
    //     })
    // })
})