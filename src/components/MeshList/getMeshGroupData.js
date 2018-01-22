/**
 * @file 物体列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function getMeshGroupData(group, mesh) {
    const result = [];
    const hash = {};
    group.map(function (item) {
        const newItem = {
            ...item,
            locked: true,
            visible: false,
            children: []
        };
        result.push(newItem);
        hash[item.label] = newItem;
    });
    Object.keys(mesh).map(key => {
        const item = mesh[key];
        const groupId = hash[item.tc.group] ? item.tc.group : 'default group';
        const groupItem = hash[groupId];
        groupItem.children.push(item);
        groupItem.locked = groupItem.locked && item.tc.locked;
        groupItem.visible = groupItem.visible || item.visible;
    });
    result.map(item => {
        if (item.children.length === 0) {
            item.locked = false;
            item.visible = true;
        }
    });
    return result;
}
