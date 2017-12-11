const ARTICLE_BODY = 'article_body';

module.exports = function (nodes) {
    var result = [];

    nodes.forEach((node) => {
        let anekdot = '';
        let p = getDivs(node, ARTICLE_BODY)[0].childNodes[0].childNodes[0];
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