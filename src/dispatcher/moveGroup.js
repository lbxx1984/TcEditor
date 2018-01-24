/**
 * @file 修改物体分组顺序
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(id1, id2) {
    const group = [];
    const result = [];
    let moving = null;
    this.get('group').map(function (item) {
        if (item.label === id1) {
            moving = item;
            return;
        }
        group.push(item);
    });
    if (!moving) return;
    group.map(function (item) {
        if (item.label === id2) {
            result.push(item);
            result.push(moving);
            moving = null;
        }
        else {
            result.push(item);
        }
    });
    if (moving) return;
    this.set('group', result);
}
