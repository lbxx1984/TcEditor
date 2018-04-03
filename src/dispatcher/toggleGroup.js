/**
 * @file 开合物体分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(id) {
    const group = [].concat([], this.get('group'));
    group.map(function (item, index) {
        if (item.label !== id) return;
        group[index] = {
            ...item,
            expend: !item.expend
        };
    });
    this.set('group', group);
}
