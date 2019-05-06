
export default function (r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    r = r.length === 1 ? `0${r}` : r;
    g = g.length === 1 ? `0${g}` : g;
    b = b.length === 1 ? `0${b}` : b;
    return '#' + r + g + b;
}
