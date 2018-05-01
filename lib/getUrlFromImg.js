
module.exports = function(stringImg) {
    return stringImg.replace(/.+"(.+)".+/, "$1");
};