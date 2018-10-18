
function getPositionInViewport(e) {
    const bounding = e.getBoundingClientRect();
    const clientTop = document.documentElement.clientTop;
    const clientLeft = document.documentElement.clientLeft;
    return {
        x: bounding.left - clientLeft,
        y: bounding.top - clientTop
    };
}

function getPositionInDocument(e) {
    const positionInViewport = getPositionInViewport(e);
    const scrollTop = 'pageYOffset' in window ? window.pageYOffset : document.documentElement.scrollTop;
    const scrollLeft = 'pageXOffset' in window ? window.pageXOffset : document.documentElement.scrollLeft;
    return {
        left: positionInViewport.x + scrollLeft,
        top: positionInViewport.y + scrollTop
    };
}

export default function (e) {
    const {x, y} = getPositionInViewport(e);
    const {left, top} = getPositionInDocument(e);
    return {x, y, left, top};
}
