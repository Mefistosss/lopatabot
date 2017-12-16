module.exports = function (url) {
    return url.split(':')[0] === 'https';
}
