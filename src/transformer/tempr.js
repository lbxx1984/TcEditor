/**
 * 物体变换器
 * 用于修改物体的位置、缩放、旋转
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * @constructor
 */
function Transformer() {
    /**2D组件*/
    this.$2d = null;
    /**3D组件*/
    this.$3d = null;
    /**2D场景*/
    this.s2d = null;
    /**3D场景*/
    this.s3d = null;
    /**配置信息*/
    this.config = {
        //解绑物体后回的调句柄
        ondetach: null,
        //变换器是否处于绑定状态
        working: false,
        //变化器是否发生了改变
        changing: false,
        //正在被变换器控制的物体的id
        meshCtrl: null
    }
}
/**
 * 3D组件的心跳，由外部触发
 */
Transformer.prototype.animate = function() {
    this.$3d.update();
}
/**
 * 鼠标正在拖动2D组件
 * @param {Object} dMouse2D DOM坐标系的坐标增量
 * @param {Object} dMouse3D 世界坐标系中的坐标增量
 */
Transformer.prototype.dragging = function(dMouse2D, dMouse3D) {
    this.$2d.moving(dMouse2D, dMouse3D);
    this.config.changing = true;
}
/**
 * 鼠标释放2D组件的拖放
 * @param {Object} dMouse2D DOM坐标系的坐标增量
 * @param {Object} dMouse3D 世界坐标系中的坐标增量
 */
Transformer.prototype.dragover = function(dMouse2D, dMouse3D) {
    this.$2d.moved(dMouse2D, dMouse3D);
    this.config.changing = false;
}

/**
 * 为变形器解绑物体
 */
Transformer.prototype.detach = function() {
    if (!this.config.working) return;
    this.$3d.detach();
    this.$2d.detach();
    this.s2d.meshClearSelected();
    this.config.meshCtrl = null;
    this.config.working = false;
    this.config.changing = false;
    if (typeof this.config.ondetach == "function") this.config.ondetach();
}
/**
 * 为变形器绑定舞台
 * @param {Object} s stage对象，对应stage.js
 */
Transformer.prototype.bind = function(s) {
    this.$3d = Transformer3D(s.$3d);
    this.$2d = Transformer2D(s.$2d);
    this.s2d = s.$2d;
    this.s3d = s.$3d;
    s.$3d.addPlugin("transformer", this);
}



/**
 * 设置2D组件的拖拽指令
 * @param {string} v 2D拖拽指令，横向(x)、纵向(y)、全向(other)
 */
Transformer.prototype.setCommand = function(v) {
    this.$2d.setCommand(v);
}
/**
 * 获取2D组件的拖拽命令
 * @return {string} 2D拖拽指令
 */
Transformer.prototype.getCommand = function() {
    return this.$2d.getCommand();
}
/**
 * 注册onChange事件句柄，此事件在物体发生变换时触发
 * @param {function} func 回调事件句柄
 */
Transformer.prototype.onChange = function(func) {
    this.$3d.onChange(func);
    this.$2d.onChange(func);
}
/**
 * 注册onFinish事件句柄，此事件在物体发生变换结束后触发
 * @param {function} func 回调事件句柄
 */ 
Transformer.prototype.onFinish = function(func) {
    this.$3d.onFinish(func);
}
/**
 * 注册onDetach事件句柄，此事件在变换器物体被卸载后触发
 * @param {function} func 回调事件句柄
 */
Transformer.prototype.onDetach = function(func) {
    this.config.ondetach = func;
}
/**
 * 获取变换器是否绑定了物体
 * @return {boolean} 是否绑定了物体
 */
Transformer.prototype.isWorking = function() {
    return this.config.working;
}
/**
 * 获取被绑定物体是否被改变了状态
 * @return {boolean} 是否改变了状态
 */
Transformer.prototype.isChanged = function() {
    return this.config.changing;
}