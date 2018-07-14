'use strict';

const assert = require('assert');
const given = require('mocha-testdata');
const SortedUpdatedKeyValueExtractor = require('../lib/extractor/sorted-updated-key-value-extractor');

describe('Print alphabetically sorted key value pairs from the most updated segment ', () => {

    given(
        [
            // [[['a--15']], "kvPair {a--15} from segmentId: {0} must be in this format {key:value}"],
            [[['a:15']], [
                {
                    "segmentId": 0,
                    "element": "a:15"
                }
            ]],
            [[['a:15'], ['a:20'], [ 'a:30' ], ['a:10']], [
                {
                    "segmentId": 3,
                    "element": "a:10"
                }
            ]],
            [[['a:15'], ['b:15'], [ 'c:15' ], ['d:15']], [
                {
                    "segmentId": 0,
                    "element": "a:15"
                },
                {
                    "segmentId": 1,
                    "element": "b:15"
                },
                {
                    "segmentId": 2,
                    "element": "c:15"
                },
                {
                    "segmentId": 3,
                    "element": "d:15"
                }
            ]],
            [[['d:15'], ['c:15'], [ 'b:15' ], ['a:15']], [
                {
                    "segmentId": 3,
                    "element": "a:15"
                },
                {
                    "segmentId": 2,
                    "element": "b:15"
                },
                {
                    "segmentId": 1,
                    "element": "c:15"
                },
                {
                    "segmentId": 0,
                    "element": "d:15"
                }
            ]],
            [[['a:15'], ['b:15'], [ 'b:20' ], ['a:20']], [
                {
                    "segmentId": 3,
                    "element": "a:20"
                },
                {
                    "segmentId": 2,
                    "element": "b:20"
                },
            ]],
            [[['ad:15'], ['ac:15'], [ 'bb:20' ], ['ba:20']], [
                {
                    "segmentId": 1,
                    "element": "ac:15"
                },
                {
                    "segmentId": 0,
                    "element": "ad:15"
                },
                {
                    "segmentId": 3,
                    "element": "ba:20"
                },
                {
                    "segmentId": 2,
                    "element": "bb:20"
                }
            ]],
            [[['aaa:15', 'aab:15', 'aac:30', 'aad:20' ], [ 'aab:15', 'abb:15', 'abc:30' ], [ 'abc:15' ], [ 'aab:15', 'aac:15', 'aad:30', 'ada:20' ]], [
                {
                    "segmentId": 0,
                    "element": "aaa:15"
                },
                {
                    "segmentId": 3,
                    "element": "aab:15"
                },
                {
                    "segmentId": 3,
                    "element": "aac:15"
                },
                {
                    "segmentId": 3,
                    "element": "aad:30"
                },
                {
                    "segmentId": 1,
                    "element": "abb:15"
                },
                {
                    "segmentId": 2,
                    "element": "abc:15"
                },
                {
                    "segmentId": 3,
                    "element": "ada:20"
                }
            ]],
            [[['a:0', 'b:0'], ['a:1', 'b:1', 'g:1','h:1'], ['a:2', 'f:2', 'g:2'], ['a:3', 'b:3', 'c:3', 'd:3'], ['b:4', 'c:4', 'd:4'], ['c:5', 'd:5'], ['d:6', 'e:6', 'f:6']], [
                {
                    "segmentId": 3,
                    "element": "a:3"
                },
                {
                    "segmentId": 4,
                    "element": "b:4"
                },
                {
                    "segmentId": 5,
                    "element": "c:5"
                },
                {
                    "segmentId": 6,
                    "element": "d:6"
                },
                {
                    "segmentId": 6,
                    "element": "e:6"
                },
                {
                    "segmentId": 6,
                    "element": "f:6"
                },
                {
                    "segmentId": 2,
                    "element": "g:2"
                },
                {
                    "segmentId": 1,
                    "element": "h:1"
                }
            ]]
        ]
    ).test('Set: ', function (segments, expectedResults) {
        try {
            const sortedUpdatedKeyValueExtractor = new SortedUpdatedKeyValueExtractor(segments, true);
            const result = sortedUpdatedKeyValueExtractor.print(segments);
            assert.deepEqual(result, expectedResults);
        } catch (e) {
            assert.equal(e.message, expectedResults);
        }
    });
});