/**
 * @file 重命名分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(groupId, newId) {
    const group = JSON.parse(JSON.stringify(this.get('group')));
    const mesh3d = this.get('mesh3d');
    Object.keys(mesh3d).map(key => {
        const mesh = mesh3d[key];
        mesh.tc.group = mesh.tc.group === groupId ? newId : mesh.tc.group;
    });
    group.map(function (item) {
        item.label = item.label === groupId ? newId : item.label;
    });
    this.fill({
        group: group,
        activeGroup: newId
    });
}
