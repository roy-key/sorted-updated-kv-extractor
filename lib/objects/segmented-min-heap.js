'use strict';

const MinHeap = require('heap');

/**
 * The SegmentedMinHeap is a MinHeap data structure, which has a unique comparator function.
 * The functions determines minimum value between two SegmentedKeyValue sk1 and sk2 pairs by the following rules:
 * * 1. if sk1 key is alphabetically precedes sk2 key
 * * 2. if sk1 key is alphabetically equal to to key sk2 -> than the minimal between them is the one with the larger segment id.
 *
 * @type {SegmentedMinHeap}
 */
module.exports = class SegmentedMinHeap {

    constructor() {
        this.heap = new MinHeap(function(a, b) {
            const aKey = a.getKey();
            const bKey = b.getKey();
            let res = aKey.localeCompare(bKey);
            if (res === 0){
                res = b.getSegmentId() - a.getSegmentId();
            }
            return res;
        });
    }

    insert(element){
        this.heap.insert(element);
    }

    pop(){
        return this.heap.pop();
    }

    empty(){
        return this.heap.empty();
    }
};