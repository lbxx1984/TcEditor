export default function (dom, pos) {
    if (!dom) return;
    dom.focus();
    dom.setSelectionRange(pos, pos);
}
