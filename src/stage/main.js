/**
 * @file 舞台系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['./Stage2D', './Stage3D', './CameraController'], function (Stage2D, Stage3D, CameraController) {


    /**
     * 获取鼠标下未锁定的物体
     *
     * @param {number} e 鼠标事件对象
     * @param {?Array.<Object3D>} objects 如果制定则在此数组中查找
     * @return {Object} 3D物体或2D物体，根据舞台系统当前显示状态确定
     */
    Stage.prototype.getMeshByMouse = function(e, objects) {
        var geo = null;
        geo = this[this.type].getMeshByMouse(e, objects);
        if (geo == null || geo.locked){
            return null;
        }
        return geo;
    };


    /**
     * 添加物体
     *
     * @param {Object} mesh 3D物体对象
     */
    Stage.prototype.add = function (mesh) {
        this.$3d.children[mesh.uuid] = mesh;
        this.$3d.scene.add(mesh);
    };


    /**
     * 移动舞台中的摄像机
     *
     * @param {number} dx 横向增量（DOM坐标）
     * @param {number} dy 纵向增量（DOM坐标）
     */
    Stage.prototype.cameraMove = function(dx, dy) {
        if (this.type === '$3d') {
            this.$3d.cameraLookAt(dx, dy);
        }
        else {
            // this.$2d.lookAt(dx, -dy, true);
        }
    };


    /**
     * 缩放舞台
     *
     * @param {Object} e 鼠标wheel事件 
     */
    Stage.prototype.zoom = function (e) {
        this[this.type].mousewheel(e);
    };


    /**
     * 获取鼠标空间位置
     *
     * @param {number} x 鼠标在当前舞台中的x坐标, 对应layerX
     * @param {number} y 鼠标在当前舞台中的y坐标, 对应layerY
     */
    Stage.prototype.getMouse3D = function (x, y) {
        return this[this.type].getMouse3D(x, y);
    };


    /**
     * resize事件
     */
    Stage.prototype.resize = function () {
        this.$3d.resize(this.container3.clientWidth, this.container3.clientHeight);
    };


    /**
     * 调用子容器接口
     *
     * @param {string} func 方法名称
     * @param {Object} param 需要传递参数
     */
    Stage.prototype.callFunction = function (func, param) {
        if (func === 'toggleHelper') {
            this.$2d[func]();
            this.$3d[func]();
        } else {
            this[this.type][func](param);
        }
    };


    /**
     * 切换显示类型
     */
    Stage.prototype.changeView = function (value) {
        var types = {
            '3d': '$3d',
            xoz: '$2d',
            yoz: '$2d',
            xoy: '$2d'
        };
        if (
            !types.hasOwnProperty(value)
            || (this.type === types[value] && this.type === '$3d')
            || (this.type === types[value] && this.type === '$2d' && value === this.$2d.param.eyes)
        ) {
            return;
        }
        this.type = types[value];
        if (this.type === '$3d') {
            this.container1.style.display = 'block';
            this.container3.style.display = 'block';
            this.container2.style.display = 'none';
            this.$3d.display = true;
        }
        else {
            this.container1.style.display = 'none';
            this.container3.style.display = 'none';
            this.container2.style.display = 'block';
            this.$3d.display = false;
            this.$2d.param.eyes = value;
            this.$2d.render();
        }
    };


    /**
     * @constructor
     *
     * @param {Object} param 初始化参数
     * @param {Object} param.container1 摄像机控制器dom
     * @param {HtmlElement} param.container2 2D舞台dom
     * @param {HtmlElement} param.container3 3D舞台dom
     */
    function Stage(param) {
        this.type = '$3d';
        this.container1 = param.container1;
        this.container2 = param.container2;
        this.container3 = param.container3;
        // 3D舞台
        this.$3d = new Stage3D({
            showGrid: true,
            clearColor: 0x464646,
            gridColor: 0x5D5D5D,
            container: param.container3,
            width: param.container3.clientWidth,
            height: param.container3.clientHeight
        });
        // 2D舞台
        this.$2d = new Stage2D({
            stage3d: this.$3d,
            showGrid: true,
            clearColor: '#464646',
            gridColor: '#5D5D5D',
            gridStep: 20,
            container: param.container2,
            width: param.container3.clientWidth,
            height: param.container3.clientHeight
        });
        // 3D摄像机控制器
        this.cameraController = new CameraController({
            textureUrl: 'resources/textures/',
            container: param.container1,
            hoverColor: 0xD97915,
            animate: true
        });
        // 绑定摄像机和控制器
        this.$3d.plugin.cameraController = this.cameraController;
        this.cameraController.param.stages.push(this.$3d);
    }


    return Stage;
});