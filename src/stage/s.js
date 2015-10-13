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
 * 删除物体
 * @param {number} id 物体id
 */
Stage.prototype.meshDelete = function(id) {
    var geo = this.$3d.getChild(id);
    if (geo) {
        this.$3d.removeGeometry(geo);
        this.$2d.deleteMesh(geo.tid);
    }
}
/**
 * 设置物体可见性
 * @param {number} id 物体id
 * @param {boolean} value 是否可见
 */
Stage.prototype.meshVisible = function(id, value) {
    var geo = this.$3d.getChild(id);
    if (geo) {
        geo.visible = value;
        if (this.view != "3d") {
            this.$2d.meshVisible(id, value);
        }
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
 * 根据物体获取3D物体
 * @param {number} id 物体id
 * @return {Object} 3D物体
 */
Stage.prototype.getGeometryByID = function(id) {
    return this.$3d.getChild(id);
}
/**
 * 获取鼠标下未锁定的物体
 * @param {number} e 鼠标事件对象
 * @return {Object} 3D物体或2D物体，根据舞台系统当前显示状态确定
 */
Stage.prototype.getGeometryByMouse = function(e) {
    var geo = null;
    if (this.view == "3d") {
        geo = this.$3d.selectGeometry(null, e);
    } else {
        geo = this.$2d.selectMeshByMouse(e);
    } 
    if (!geo || geo.locked) return null;
    return geo;
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
/**
 * 为当前显示的DOM组件添加class，一般用于鼠标样式
 * @param {string} className 类名称
 */
Stage.prototype.addClass = function(className) {
    this.current.addClass(className);
}
/**
 * 为当前显示的DOM组件移除class，一般用于鼠标样式
 * @param {string} className 类名称
 */
Stage.prototype.clearClass = function() {
    this.current.removeClass();
}
/**
 * 切换舞台显示状态
 * @param {string} view 舞台视角：3d、xoz、xoy、yoz
 */
Stage.prototype.changeTo = function(view) {
    if (view == "3d") {
        this.current = this.$3d;
        this.$2d.addClass("workspace_hideStage");
        this.$3d.display(true);
        this.$3d.removeClass("workspace_hideStage");
        this.cameraController.removeClass("workspace_hideStage");
    } else {
        this.current = this.$2d;
        this.$2d.removeClass("workspace_hideStage");
        this.$2d.changeView(view);
        this.$3d.display(false);
        this.$3d.addClass("workspace_hideStage");
        this.cameraController.addClass("workspace_hideStage");
    }
    this.view = view;
}
/**
 * 修改舞台大小
 * @param {number} width 宽度
 * @param {number} height 高度 
 */
Stage.prototype.resize = function(width, height) {
    if (!this.$2d) return;
    this.$3d.resize(width, height);
    this.$2d.resize(width, height);
}
/**
 * 获取鼠标下物体的关节徽标
 * @param {Object} e 鼠标事件对象
 * @param {Array} joints 3D空间中的关节徽标数组
 * @return {Object} 3D空间中的3D徽标
 */
Stage.prototype.getMorpherJointByMouse = function(e, joints) {
    var geo = null;
    if (this.view == "3d") {
        geo = this.$3d.selectGeometry(joints, e);
    } else if (e.target.tagName == "circle" && e.target.morpherType == "JOINT") {
        geo = joints[e.target.index];
    }
    return geo;
}
/**
 * 获取鼠标下的变换器把手名称
 * @param {Object} e 鼠标事件句柄
 * @return 变形器把手名称
 *        本方法只在非3D状态下有效
 */
Stage.prototype.getTransformerCommand = function(e) {
    if (this.view == "3d" || !e || !e.target) return null;
    if (e.target.tcType == "T2D") return {
        cmd: e.target.tcItem,
        cursor: "workspace_" + e.target.tcCursor
    };
    return null
}
/**
 * 获取舞台中的物体的3D坐标
 * @return {Object} 3D坐标
 */
Stage.prototype.getMousePosition = function() {
    return this.current.getMousePosition(this.view);
}
/**
 * 为舞台系统绑定组件
 * @param {Object} stage2d 2D组件
 * @param {Object} stage3d 3D组件
 * @param {Object} cameraController 3D组件用的摄像机控制器
 */
Stage.prototype.bind = function(stage2d, stage3d, cameraController) {
    this.$2d = stage2d;
    this.$3d = stage3d;
    this.current = this.$3d;
    this.cameraController = cameraController;
    this.scene = stage3d.getScene();
    cameraController.addStage(stage3d);
    stage3d.addPlugin("cameraController", cameraController);
    stage2d.bindStage(stage3d);
}

