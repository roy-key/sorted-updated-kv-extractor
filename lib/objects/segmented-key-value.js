'use strict';

/**
 * An object which stores the key-value pair of each segment, and its segment meta data
 * @type {SegmentedKeyValue}
 */
module.exports = class SegmentedKeyValue {

    constructor(segmentId, segmentSize, kvPair) {

        this.segmentMetaData = {
            segmentId: segmentId, segmentSize: segmentSize
        };

        this.kvPair = kvPair;
        const [key, value] = kvPair.split(":");
        this.key = key;
        this.value = value;
    }

    getSegmentId() {
        return this.segmentMetaData.segmentId;
    }

    getSegmentSize() {
        return this.segmentMetaData.segmentSize;
    }

    getKvPair() {
        return this.kvPair;
    }

    getKey() {
        return this.key;
    }

    getValue() {
        return this.value;
    }

    setSegmentMetaData(segmentId, segmentSize) {
        this.segmentMetaData.segmentId = segmentId;
        this.segmentMetaData.segmentSize = segmentSize;
    }

    setKvPair(kvPair) {
        this.kvPair = kvPair;
    }

    setValue(value) {
        this.value = value;
    }
};
