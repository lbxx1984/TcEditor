export default function (dom, pos) {
    // 非IE浏览器
    if(dom.setSelectionRange) {
        dom.focus();
        dom.setSelectionRange(pos, pos);
    }
    // IE
    else if (dom.createTextRange) {
        const range = dom.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos)
        range.moveStart('character', pos);
        range.select();
    }
}
