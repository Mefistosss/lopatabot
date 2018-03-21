var getDomObjects = require('../../lib/getDomObjects.js');
var ARTICLE_BODY = 'article_body';

module.exports = function (nodes) {
    var result = [];

    nodes.forEach(function (node) {
        var anekdot = '';
        var p = getDomObjects(node, ARTICLE_BODY)[0].childNodes[0].childNodes[0];
        p.childNodes.forEach(function (child) {
            if (child.nodeName === '#text') {
                anekdot += child.value;
            } 
        });
        
        if (anekdot.length) {
            result.push(anekdot);
        }
    });

    return result;
}