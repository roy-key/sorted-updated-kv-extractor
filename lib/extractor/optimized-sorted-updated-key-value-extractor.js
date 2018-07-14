'use strict';

const MinHeap = require('heap');
const SegmentedKeyValue = require('../objects/segmented-key-value');

const SortedUpdatedKeyValueExtractor = require('./sorted-updated-key-value-extractor');

/**
 * The OptimizedSortedUpdatedKeyValueExtractor implements the same logic as the SortedUpdatedKeyValueExtractor in a different way.
 *
 * With additional max O(N) memory, it will visit all N*M key-values, but will insert each key only once, meaning that the
 * O(log(N)) insertions will be as many times as the number of different keys.
 *
 * @type {OptimizedSortedUpdatedKeyValueExtractor}
 */
module.exports = class OptimizedSortedUpdatedKeyValueExtractor extends SortedUpdatedKeyValueExtractor {

    constructor(segments, isTesting) {
        super(segments, isTesting);
    }

    /**
     * Initializing the MinHeap by putting the first relevant key-value pair of each segment.
     * the first relevant key is the most updated key from all segments.
     * meaning if Segment N as the same key as segment K where K<M, than the MinHeap will store the next relevant key from
     * segment K.
     *
     * segmentedKeyValueMinHeapMapping is a mapping between the key in the min heap and a corresponding segmented key-value object.
     *
     * @param segments list of segments
     * @param numberOfSegments
     *
     * @returns SegmentedMinHeap with numberOfSegments elements, every element is the first relevant key-value pair of each segment.
     */
    initializeMinHeap(segments, numberOfSegments) {

        this.segmentedKeyValueMinHeapMapping = {};
        this.minHeap = this.initializeAlphabeticallySortedMinHeap();

        for (let segmentId = numberOfSegments - 1; segmentId > -1; segmentId--) {
            while (!this.insertToMinHeap(segments, segmentId));
        }
    }

    /**
     * Initialize an Alphabetically sorted MinHeap, where a a is previous to b if a key is alphabetically sorted before b key
     * a and b are at the format of key:value.
     *
     * @returns {*}
     */
    initializeAlphabeticallySortedMinHeap() {
        return new MinHeap(function (a, b) {
            const aKey = a.getKey();
            const bKey = b.getKey();
            return aKey.localeCompare(bKey);
        });
    }

    /**
     * Insert to the min heap in the following rules:
     * * If a key is not in the MinHeap - insert it to the min heap and update the segmentedKeyValueMinHeapMapping.
     * * else, the key is already inside the MinHeap, than:
     * ** if the value of the key which is inside the MinHeap is less updated than the inserted key-value pair, update the value of the key.
     * ** else if the segment of the inserted key-value as any more key-values which hasn't been handle, try to insert them with the above rules.
     * *** else, it means that we iterated over all of this segment key-value pair, than were done with that segment.

     * @param segments
     * @param segmentId
     * @returns boolean, tue whether we finish the insertion, by insert a new segmented key-value pair to the min heap, or finish iterating on the segment.
     *
     */
    insertToMinHeap(segments, segmentId) {

        const segment = this.getSegmentBySegmentId(segments, segmentId);
        const segmentSize = segment.length;

        const keyValuePairFromSegment = this.getKeyValuePairFromSegment(segment, this.currentKeyValueIndexPerSegmentArray[segmentId]);
        const [key, value] = keyValuePairFromSegment.split(":");

        // if its not in the MinHeap - insert it to the min heap and update the segmentedKeyValueMinHeapMapping
        if (!this.segmentedKeyValueMinHeapMapping.hasOwnProperty(key)) {
            let segmentedKeyValue = new SegmentedKeyValue(segmentId, segmentSize, keyValuePairFromSegment);
            this.minHeap.insert(segmentedKeyValue);
            this.segmentedKeyValueMinHeapMapping[key] = segmentedKeyValue;
            return true;

            // if the current value segment id is less than the new one, it means their was a new value for the same key, so we need to update it.
            //
            // set the key to the new value, and then insertToMinHeap the next key-value pair of the previous (outdated for this key) segment id.
        } else if (this.segmentedKeyValueMinHeapMapping[key].segmentMetaData.segmentId < segmentId) {

            const outdatedSegmentedKeyValuePairSegmentId = this.segmentedKeyValueMinHeapMapping[key].segmentMetaData.segmentId;
            const outdatedSegmentedKeyValuePairSegmentSize = this.segmentedKeyValueMinHeapMapping[key].segmentMetaData.segmentSize;

            this.segmentedKeyValueMinHeapMapping[key].setSegmentMetaData(segmentId, segmentSize);
            this.segmentedKeyValueMinHeapMapping[key].setValue(value);
            this.segmentedKeyValueMinHeapMapping[key].setKvPair(keyValuePairFromSegment);

            if (this.segmentHasMoreElements(outdatedSegmentedKeyValuePairSegmentId, outdatedSegmentedKeyValuePairSegmentSize)) {
                this.advanceCurrentSegmentedKeyValueIndex(outdatedSegmentedKeyValuePairSegmentId);
                this.insertToMinHeap(segments, outdatedSegmentedKeyValuePairSegmentId);
            }
        }

        // if this segment has more elements, but the current key is less updated than the the one already in the min heap - ignore it.
        else if (this.segmentHasMoreElements(segmentId, segmentSize)) {
            this.advanceCurrentSegmentedKeyValueIndex(segmentId);
            this.insertToMinHeap(segments, segmentId);

            // there is no more key-value pair for that segment.
        } else {
            return true;
        }
    }

    popFromMinHeap() {
        const currentSegmentedKeyValuePair = this.minHeap.pop();
        delete this.segmentedKeyValueMinHeapMapping[currentSegmentedKeyValuePair.getKey()];
        return currentSegmentedKeyValuePair;
    }

    /**
     * prints key-value from a list of segments, in a sorted updated way.
     * @param segments
     * @returns {*}
     */
    print(segments) {

        let result = null;

        if (this.isTesting) {
            result = [];
        }

        while (!this.minHeap.empty()) {

            const currentSegmentedKeyValuePair = this.popFromMinHeap();

            const segmentId = currentSegmentedKeyValuePair.getSegmentId();
            const segmentSize = currentSegmentedKeyValuePair.getSegmentSize();

            this.printCurrentSegmnetedKeyValuePair(currentSegmentedKeyValuePair);

            if (this.isTesting) {
                result.push({
                    'segmentId': segmentId,
                    'element': currentSegmentedKeyValuePair.getKvPair()
                });
            }

            if (this.segmentHasMoreElements(segmentId, segmentSize)) {
                this.advanceCurrentSegmentedKeyValueIndex(segmentId);
                while (!this.insertToMinHeap(segments, segmentId));
            }

        }

        if (this.isTesting) {
            return result;
        }

    }

    /**
     * set the current index pointer of the received segmentId to the next key-value pair.
     *
     * @param segmentId
     */
    advanceCurrentSegmentedKeyValueIndex(segmentId) {
        this.setCurrentKeyValueIndex(segmentId, this.getNextKeyValueIndexPerSegment(segmentId));
    }
};