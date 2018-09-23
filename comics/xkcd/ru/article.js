var getDomObjects = require('../../../lib/getDomObjects.js');
var getFirstChildByTag = require('../../../lib/getFirstChildByTag.js');
var getAttr = require('../../../lib/getAttr.js');
var getFirstChildByTag = require('../../../lib/getFirstChildByTag.js');

function getText(node) {
    var result = '';

    if (node && node.childNodes) {
        node.childNodes.forEach(function (child) {
            if (child.nodeName === '#text') {
                result += child.value;
            } else if (child.nodeName === 'br') {
                result += "\n";
            }
        });
    }

    if (result === '') {
        result = null;
    }


    return result;
}

module.exports = function (nodes) {
    var result = null,
        img, title, tmp, comics_text;

    tmp = getFirstChildByTag(nodes, 'a');

    if (tmp) {
        img = getFirstChildByTag(tmp.childNodes, 'img');

        if (img) {
            img = getAttr(img.attrs, 'src');
        }
    }

    tmp = getDomObjects({ childNodes: nodes }, 'comics_text');
    if (tmp && tmp.length) {
        comics_text = getText(tmp[0]);
    }

    tmp = getFirstChildByTag(nodes, 'h1');
    title = getText(tmp);

    if (img) {
        result = {
            img: img,
            title: title,
            comicsText: comics_text
        }
    }

    return result;
}
