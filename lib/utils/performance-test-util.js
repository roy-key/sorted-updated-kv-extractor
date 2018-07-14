module.exports.generateLotsOfValidSegments = function () {
    let segments = [];
    let availableKeys = [];
    for (let i = 0; i < 100; i++) {
        availableKeys.push(getRandomString(5, 'A').toLowerCase());
    }

    for (let i = 0; i < 15; i++) {
        const segment = [];
        let from = Math.floor(Math.random() * 15);
        let to = Math.floor(Math.random() * (15-from)) + (from + 1);
        let currentAvailableKeys = availableKeys.slice(from, to);
        currentAvailableKeys.sort();
        for (let key of currentAvailableKeys) {

            const keyValuePair = key + ":" + i;
            segment.push(keyValuePair)
        }
        segments.push(segment)
    }

    return segments;

    // console.log(segments);
};

getRandomString = function (len, an) {
    an = an && an.toLowerCase();
    let str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        let r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
};