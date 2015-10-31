/**
 * @file 舞台系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['./Stage2D', './Stage3D', './CameraController'], function (Stage2D, Stage3D, CameraController) {


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
            clearColor: 0x3D3D3D,
            gridColor: 0x8F908A,
            container: param.container3,
            meshHoverColor: 0xd97915,
            width: param.container3.clientWidth,
            height: param.container3.clientHeight
        });
        // 2D舞台
        this.$2d = new Stage2D({
            stage3d: this.$3d,
            showGrid: true,
            clearColor: '#3D3D3D',
            gridColor: '#8F908A',
            gridStep: 20,
            scale: 2,
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


    /**
     * 切换物体属性
     *
     * @param {string} uuid 物体uuid
     */
    Stage.prototype.toogleMeshProp = function(uuid, prop) {
        var v = !this.$3d.children[uuid][prop];
        this.$3d.children[uuid][prop] = v;
        this.$2d.renderMesh();
    };


    /**
     * 修改物体颜色
     *
     * @param {string} uuid 物体标识
     * @param {?string} type 要切换的颜色 hover,active,null(原色)
     */
    Stage.prototype.changeMeshColor = function (uuid, type) {
        var mesh = this.$3d.children[uuid];
        var editorKey = '__tceditor__';
        if (!mesh) {
            return;
        }
        // 记录3D物体原始颜色
        if (!mesh.hasOwnProperty(editorKey)) {
            mesh[editorKey] = {};
        }
        if (!mesh[editorKey].hasOwnProperty('color')) {
            mesh[editorKey].color = mesh.material.color.getHex();
        }
        // 清理
        if (!type) {
            mesh.material.setValues({color: mesh[editorKey].color});
            this.$2d.renderMesh(null, null, '');
            return;
        }
        // 重上色
        var colors = {
            hover: this.$3d.param.meshHoverColor,
            active: this.$3d.param.meshActiveColor
        };
        if (colors.hasOwnProperty(type)) {
            mesh.material.setValues({color: colors[type]});
        }
        // 处理2D舞台
        if (this.type === '$2d') {
            this.$2d.renderMesh(null, null, (type === 'hover' ? uuid : ''));
        }
    };


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
     * 删除物体
     * @param {string} uuid 物体uuid
     */
    Stage.prototype.remove = function(uuid) {
        this.$3d.scene.remove(this.$3d.children[uuid]);
        delete this.$3d.children[uuid];
        this.$2d.loadMesh();
        this.$2d.renderMesh();
    };


    /**
     * 移动舞台中的摄像机
     *
     * @param {number} dx 横向增量（DOM坐标）
     * @param {number} dy 纵向增量（DOM坐标）
     */
    Stage.prototype.cameraMove = function(dx, dy) {
        this[this.type].cameraLookAt(dx, dy);
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
     * @param {Object} e 鼠标事件
     */
    Stage.prototype.getMouse3D = function (e) {
        return this[this.type].getMouse3D(e);
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
            return this[this.type][func](param);
        }
    };


    /**
     * 切换显示类型
     */
    Stage.prototype.changeView = function (value) {
        var types = {
            '3d': '$3d',
            xoz: '$2d',
            zoy: '$2d',
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
     * resize事件
     */
    Stage.prototype.resize = function () {
        var state = this.container3.parentNode;
        this.$3d.resize(state.clientWidth, state.clientHeight);
        this.$2d.resize(state.clientWidth, state.clientHeight);
    };


    return Stage;
});