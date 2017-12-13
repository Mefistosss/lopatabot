const getDomObjects = require('../../lib/getDomObjects.js');;
const ARTICLE_BODY = 'article_body';

module.exports = function (nodes) {
    var result = [];

    nodes.forEach((node) => {
        let anekdot = '';
        let p = getDomObjects(node, ARTICLE_BODY)[0].childNodes[0].childNodes[0];
        p.childNodes.forEach((child) => {
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