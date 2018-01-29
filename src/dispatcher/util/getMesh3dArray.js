/**
 * @file 获取3D物体数组
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function(model) {
    return Object.keys(model.store.mesh3d).map(key => model.store.mesh3d[key]);
}
