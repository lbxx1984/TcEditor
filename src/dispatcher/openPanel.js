/**
 * @file 打开控制面板
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function (panel) {
    const arr = [];
    let have = false;
    this.get('panel').map(function (item) {
        if (item.type !== panel) {
            arr.push(item);
            return;
        }
        have = true;
    });
    if (!have) {
        arr.push({type: panel, expend: true});
    }
    this.set('panel', arr);
}
