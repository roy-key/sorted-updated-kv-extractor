'use strict';

const SegmentedMinHeap = require('../objects/segmented-min-heap');
const SegmentedKeyValue = require('../objects/segmented-key-value');

/**
 * The SortedUpdatedKeyValueExtractor will receive a list of segments, which each segment would have a list of sorted
 * key-value pairs, and will print in alphabetically order all the key-value pairs from all the segments.
 *
 * In each segment a key can appear at most one time, but the same key could be in another segment.
 * then the key-value pair should be taken from the most updated segment, i.e the segment which has the bigger index in the segments array.
 *
 * Currently, for simplicity and understating, all the segments data is loaded into memory.
 * To support very big segments it could be loaded in chucks of data from files or db;
 *
 * * Each time the first M number of key-value pairs will be loaded from all the N segments, and after it, another M
 * * key-value pairs would be loaded from that specific segment, until all its kv would be handled.
 *
 * * the algorithm would halt after all the kv from all the segments had been handled.
 *
 * * Complexity:
 * Where M is the biggest number of kv from as segment i, and there is N segments.
 * Each insertion to the Segmented min heap is of O(log(N)).
 *
 * Run time: O(N) * (M) * O(log(N)) = O(N*M*log(N)).
 * Memory: O(N) additional space.
 *
 * @type {SortedUpdatedKeyValueExtractor}
 */
module.exports = class SortedUpdatedKeyValueExtractor {

    /**
     * Prints updated key-value pairs in alphabetically sorted, it uses a segments min-heap which holds the most minimal key-value pair of each segment at any time.
     * its initialize the SegmentedMinHeap, and the currentKeyValueIndexPerSegmentArray.
     *
     * @param segments - list of segments, each segment is a list of alphabetically sorted updated key-value pairs
     * @param isTesting - the SortedUpdatedKeyValueExtractor should return an value, because of its high scale performance, its only prints the next key-value pair.
     * but for testing, with low amount of data, it would return the output.
     */
    constructor(segments, isTesting) {
        const numberOfSegments = segments.length;
        this.initializeCurrentKeyValueIndexPerSegmentArray(numberOfSegments);
        this.initializeMinHeap(segments, numberOfSegments);
        this.isTesting = isTesting;
    }

    /**
     * currentKeyValueIndexPerSegmentArray is an array which holds the current key-value pair handled by each segment
     *  at initialization all segments holds the 'zero' index as their first elements to handle.
     *
     * @param numberOfSegments
     * @returns Array with numberOfSegments elements, each element equals to 0
     */
    initializeCurrentKeyValueIndexPerSegmentArray(numberOfSegments) {
        this.currentKeyValueIndexPerSegmentArray = new Array(numberOfSegments).fill(0);
    }

    /**
     * Initializing the Segmented MinHeap by putting the first key-value pair of each segment.
     *
     * @param segments list of segments
     * @param numberOfSegments
     *
     * @returns SegmentedMinHeap with numberOfSegments elements, every element is the first key-value pair of each segment.
     */
    initializeMinHeap(segments, numberOfSegments) {

        const segmentedMinHeap = new SegmentedMinHeap();

        for (let segmentId = 0; segmentId < numberOfSegments; segmentId++) {
            const segment = this.getSegmentBySegmentId(segments, segmentId);
            const segmentSize = segment.length;
            const segmentedKeyValue = new SegmentedKeyValue(segmentId, segmentSize, this.getKeyValuePairFromSegment(segment, this.currentKeyValueIndexPerSegmentArray[segmentId]));
            segmentedMinHeap.insert(segmentedKeyValue);
        }

        this.minHeap = segmentedMinHeap;
    }

    /**
     * Prints updated key-value pairs in alphabetically sorted.
     *
     * @param segments list of segments, which contains a list of key-value pairs.
     * @returns resultsArray alphabetically sorted updated key-value pairs
     */
    print(segments) {

        let previousSegmentedKeyValue = null, result = null;

        if (this.isTesting) {
            result = [];
        }

        while (!this.minHeap.empty()) {

            const currentSegmentedKeyValuePair = this.minHeap.pop();
            const segmentId = currentSegmentedKeyValuePair.getSegmentId();

            if (this.shouldPrintKeyValuePair(previousSegmentedKeyValue, currentSegmentedKeyValuePair)) {
                this.printCurrentSegmnetedKeyValuePair(currentSegmentedKeyValuePair);
                if (this.isTesting) {
                    result.push({
                        'segmentId': segmentId,
                        'element': currentSegmentedKeyValuePair.getKvPair()
                    });
                }
            }

            const segmentSize = currentSegmentedKeyValuePair.getSegmentSize();

            if (this.segmentHasMoreElements(segmentId, segmentSize)) {

                const currentSegment = this.getSegmentBySegmentId(segments, segmentId);
                const nextKeyValueIndex = this.getNextKeyValueIndexPerSegment(segmentId);
                const newKeyValuePair = this.getKeyValuePairFromSegment(currentSegment, nextKeyValueIndex);

                const segmentedKeyValue = new SegmentedKeyValue(segmentId, segmentSize, newKeyValuePair);

                this.minHeap.insert(segmentedKeyValue);
                this.setCurrentKeyValueIndex(segmentId, nextKeyValueIndex);

            }

            previousSegmentedKeyValue = currentSegmentedKeyValuePair;

        }

        if (this.isTesting) {
            return result;
        }
    }

    /**
     * Because each segment could have the same key-value pair and we want the most updated value for a given key,
     * we would like to discard the same key from an outdated segment.
     *
     * The SegmentMinHeap guarantee us that the key-value pair from the most updated segment would be popped
     *
     * @param previousSegmentedKeyValue the previousSegmentedKeyValue, it would equals null if the currentSegmentedKeyValue is the first node.
     * @param currentSegmentedKeyValue the current SegmentedKeyValue Pair which popped from the min-heap
     *
     * @returns boolean whether the segmented key-value should be printed.
     */
    shouldPrintKeyValuePair(previousSegmentedKeyValue, currentSegmentedKeyValue) {
        return previousSegmentedKeyValue == null || previousSegmentedKeyValue.getKey() !== currentSegmentedKeyValue.getKey();
    }

    getNextKeyValueIndexPerSegment(segmentId) {
        return this.currentKeyValueIndexPerSegmentArray[segmentId] + 1;
    }

    setCurrentKeyValueIndex(segmentId, currentKeyValueIndex) {
        this.currentKeyValueIndexPerSegmentArray[segmentId] = currentKeyValueIndex;
    }

    getSegmentBySegmentId(segments, segmentId) {
        return segments[segmentId];
    }

    getKeyValuePairFromSegment(segment, segmentedKeyValueIndex) {
        return segment[segmentedKeyValueIndex];
    }

    segmentHasMoreElements(segmentId, segmentSize) {

        const nextKeyValueIndex = this.getNextKeyValueIndexPerSegment(segmentId);
        return nextKeyValueIndex < segmentSize;
    }

    printCurrentSegmnetedKeyValuePair(currentMinimalNode) {
        console.log(currentMinimalNode);
    }
};