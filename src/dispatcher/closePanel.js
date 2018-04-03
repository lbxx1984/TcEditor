/**
 * @file 删除控制面板
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function (type) {
    const panel = [];
    this.get('panel').map(function (item) {
        if (item.type === type) return;
        panel.push(item);
    });
    this.set('panel', panel);
}
