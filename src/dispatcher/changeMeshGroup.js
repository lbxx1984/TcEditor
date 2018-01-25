/**
 * @file 修改物体的分组
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(uuid, group) {
    const mesh = this.get('mesh3d')[uuid];
    if (!mesh) return;
    mesh.tc.group = group;
    this.set('timer', +new Date());
}
