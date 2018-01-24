/**
 * @file 开合控制面板
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function (type) {
    const panel = [].concat([], this.get('panel'));
    panel.map(function (item, index) {
        if (item.type !== type) return;
        panel[index] = {
            ...item,
            expend: !item.expend
        };
    });
    this.set('panel', panel);
}
