/**
 * 修改物体
 * @param {Object} geo 3D物体对象
 * @param {string} type 物体修改的类型：
 *        joint：修改关节；
 *        scale：缩放；
 *        position：位置；
 *        rotation：旋转
 * @param {number|string} item 具体操作分量
 *        当type为‘joint’时，item为number，表示关节的索引号
 *        当type未其他时，item为string，取x、y、z，表示对应分量
 * @param {Array|number} value 变更值
 *        当type为‘joint’时，value为数组，表示关节的世界坐标
 *        当type为其他时，value为number，表示需要设置的值
 * @param {boolean} sync 当type为‘scale’时，是否进行三轴同时缩放
 */
Stage.prototype.meshTransform = function(geo, type, item, value, sync) {
    if (!geo) return;
    if (type == "joint") {
        var pos = tcMath.Global2Local(value[0], value[1], value[2], geo);
        geo.geometry.vertices[item].x = pos[0];
        geo.geometry.vertices[item].y = pos[1];
        geo.geometry.vertices[item].z = pos[2];
        geo.geometry.verticesNeedUpdate = true;
    } else {
        if (type != "scale") {
            geo[type][item] = value;
        } else {
            if (sync) {
                geo.scale.x = geo.scale.x * value;
                geo.scale.y = geo.scale.y * value;
                geo.scale.z = geo.scale.z * value;
            } else {
                geo.scale[item] = geo.scale[item] * value;
            }
        }
    }
    this.$2d.fresh();
    if (typeof this.eventHandle["onMesh3DFresh"] == "function") {
        this.eventHandle["onMesh3DFresh"]();
    }
}


/**
 * 锁定物体
 * @param {number} id 物体id
 * @param {boolean} value 是否锁定
 */
Stage.prototype.meshLock = function(id, value) {
    var geo = this.$3d.getChild(id);
    if (geo) {
        geo.locked = value;
    }
}



/**
 * 缩放摄像机
 * @param {number} v 缩放值，在2D中范围时[0.5,6]，在3D中是[50,5000]
 */
Stage.prototype.zoomTo = function(v) {
    if (isNaN(v)) return;
    this.current.zoomTo(v);
}
/**
 * 设置舞台背景颜色
 * @param {string} e 颜色串，如"#FF0000"表示红色
 */
Stage.prototype.setRendererColor = function(e) {
    this.$3d.setRendererColor(e);
    this.$2d.css({
        "background-color": e
    });
}
/**
 * 设置舞台中网格的颜色
 * @param {string} e 颜色串，如"#FF0000"表示红色
 */
Stage.prototype.setGridColor = function(e) {
    this.$3d.setGridColor(e);
    this.$2d.setGridColor(e);
}


