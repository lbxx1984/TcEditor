/**
 * 骨骼控制器
 * 用于修改物体内部的关节位置
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * @constructor
 */
function Morpher() {
    /**本控制器下属的2D子单元*/
    this.$2d = null;
    /**本控制器下属的3D子单元*/
    this.$3d = null;
    /**与本控制器绑定的2D舞台，Stage2D.js*/
    this.s2d = null;
    /**与本控制器绑定的3D舞台，Stage3D.js*/
    this.s3d = null;
    /**与本控制器绑定的3D场景*/
    this.scene = null;
    /**本控制使用的3D关节控制器*/
    this.jointCtrl = null;
    /**一些控制信息*/
    this.config = {
        /**本控制器正在控制的3D物体*/
        geo: null,
        /**本控制器正在控制的关节*/
        joint: null,
        /**本控制器是否正处在拖动中*/
        changing: false,
        /**本控制器的工作状态：0未工作；1已选择物体；2已选择关节*/
        working: 0,
        /**本控制卸载时的回调*/
        ondetach: null,
        /**本控制器所控制关节发生移动后的回调*/
        onchange: null
    }
}
/**
 * 刷新3D关节控制器，由3D场景心跳函数触发
 *（只对3D编辑器负责）
 */
Morpher.prototype.animate = function() {
    this.jointCtrl.update();
};
/**
 * 2D子单元拖动
 *（只对2D编辑器负责）
 * @param {number} d2 关节在绘制坐标系left方向变动量
 * @oaram {number} d3 关节在绘制坐标系top方向变动量
 */
Morpher.prototype.dragging = function(d2, d3) {
    this.$2d.dragging(d2, d3);
    this.config.changing = true;
}
/**
 * 2D子单元拖动结束
 *（对全编辑器负责）
 * @param {Object} op 鼠标按下时，鼠标对应的3D世界坐标
 * @param {Object} np 鼠标抬起时，鼠标对应的3D世界坐标
 */
Morpher.prototype.dragover = function(op, np) {
    var dp = this.$2d.dragover(op, np);
    this.config.changing = false;
    if (this.config.joint) {
        this.config.joint.position.x += dp[0];
        this.config.joint.position.y += dp[1];
        this.config.joint.position.z += dp[2];
    }
    if (this.config.onchange) this.config.onchange(this.config.joint.index);
}
/**
 * 设置2D子单元的拖拽命令
 *（只对2D编辑器负责）
 * @param {string} v 拖拽命令
 */
Morpher.prototype.setCommand = function(v) {
    this.$2d.setCommand(v);
}
/**
 * 获取2D子单元当前的拖拽命令
 *（只对2D编辑器负责）
 * @return {string} 拖拽命令
 */
Morpher.prototype.getCommand = function() {
    return this.$2d.getCommand();
}
/**
 * 令本控制器绑定关节
 *（对全编辑器负责）
 * @param {Object} joint 3D空间中对应的关节徽标
 */
Morpher.prototype.attachJoint = function(joint) {
    this.config.joint = joint;
    this.config.working = 2;
    this.jointCtrl.attach(joint);
    this.scene.add(this.jointCtrl);
    this.$2d.attachJoint(joint.index);
}
/**
 * 令本控制器卸载关节
 *（对全编辑器负责）
 */
Morpher.prototype.detachJoint = function() {
    this.config.working = 1;
    this.jointCtrl.detach();
    this.scene.remove(this.jointCtrl);
    this.$2d.detachJoint();
}
/**
 * 令本控制器绑定物体
 *（对全编辑器负责）
 * @param {Object} geo 3D空间中的物体对象
 */
Morpher.prototype.attach = function(geo) {
    if (this.jointCtrl.added) return;
    if (this.config.working != 0) this.detach(true);
    this.config.working = 1;
    this.config.geo = geo;
    this.$3d.attach(geo);
    this.$2d.attach(geo.tid);
    this.s2d.meshSetSelected(geo.tid);
}
/**
 * 令本控制器卸载物体
 *（对全编辑器负责）
 */
Morpher.prototype.detach = function() {
    if (this.config.working == 0) return;
    this.config.working = 0;
    this.config.geo = null;
    this.config.joint = null;
    this.$3d.detach();
    this.$2d.detach();
    this.s2d.meshClearSelected();
    this.jointCtrl.detach();
    this.scene.remove(this.jointCtrl);
    if (this.config.ondetach) this.config.ondetach();
}
/**
 * 重新加载关节
 *（对全编辑器负责）
 */
Morpher.prototype.reloadJoint = function() {
    if (this.config.working == 0) return;
    this.$3d.reloadJoint();
    this.$2d.update();
}
/**
 * 重新设置关节徽标大小
 *（只对3D编辑器负责）
 */
Morpher.prototype.resizeJoint = function() {
    this.$3d.resizeJoint();
}
/**
 * 绑定本控制和主编辑器
 *（对全编辑器负责）
 * @param {Object} s 主编辑器对象，对应Stage.ks
 */
Morpher.prototype.bind = function(s) {
    this.s2d = s.$2d;
    this.s3d = s.$3d;
    this.scene = this.s3d.getScene();
    this.jointCtrl = new THREE.TransformControls(
                        this.s3d.getCamera(),
                        this.s3d.getRenderer().domElement
                    );
    this.jointCtrl.setMode("translate");
    this.jointCtrl.setSpace("world");
    this.$2d = Morpher2D(this.s2d);
    this.$3d = Morpher3D(this.s3d.getCamera(), this.scene);
    this.s3d.addPlugin("morpher", this);
    var _this = this;
    this.jointCtrl.onChange = function() {
        _this.$3d.moving(_this.config.joint);
        if (_this.config.onchange) _this.config.onchange(_this.config.joint.index);
    }
    return;
}
/**
 * 注册本控制器卸载事件
 * @param {function} func 卸载物体时的回调函数
 */
Morpher.prototype.onDetach = function(func) {
    this.config.ondetach = func;
}
/**
 * 注册本控制器关节移动事件
 * @param {function} func 关节移动时的回调函数
 */
Morpher.prototype.onChange = function(func) {
    this.config.onchange = func;
}
/**
 * 获取编辑器中所有的3D关节徽标
 *（只对3D编辑器负责）
 * @return {Array} 3D场景中所有正在工作的关节数组
 */
Morpher.prototype.getJoints = function() {
    return this.$3d.getJoints();
}
/**
 * 获取本控制器的工作状态
 * @param {number} 编辑器工作状态
 */
Morpher.prototype.isWorking = function() {
    return this.config.working;
}
/**
 * 获取本控制器是否发生了变化
 * @param {number} 变化标记
 */
Morpher.prototype.isChanged = function() {
    return this.config.changing;
}