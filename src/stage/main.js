/**
 * @file 舞台系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {

    var Stage2D = require('./Stage2D');
    var Stage3D = require('./Stage3D');
    var CameraController = require('./CameraController');


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
        // {Array.<Mesh3D>} 处于激活状态的mesh hash.
        this.activeMesh = {};
        // {?Mesh3D} 处于鼠标悬浮状态的mesh
        this.hoverMesh = null;
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
            stage: this,
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
     * @param {string} prop 需要设置的属性
     */
    Stage.prototype.toogleMeshProp = function(uuid, prop) {
        var v = !this.$3d.children[uuid][prop];
        this.$3d.children[uuid][prop] = v;
        this.$2d.renderMesh();
    };

    /**
     * 设置物体属性
     *
     * @param {string} uuid 物体uuid
     * @param {string} prop 需要设置的属性
     * @param {string | boolean} 将要放在属性上的值
     */
    Stage.prototype.setMeshProp = function (uuid, prop, value) {
        this.$3d.children[uuid][prop] = value;
        this.$2d.renderMesh();
    };

    /**
     * 修改物体颜色，并在必要时重新渲染2D舞台
     *
     * @param {?Mesh3D} mesh 物体
     * @param {?string} type 要切换的颜色 hover,active,null(原色)
     * (null, 'hover'): 还原处于hover状态物体
     * (null, 'active'): 还原处于active状态物体
     * (string, 'hover'): 将uuid标明的物体设为hover状态
     * (string, 'active'): 将uuid标明的物体设为active状态
     */
    Stage.prototype.changeMeshColor = function (mesh, type) {

        var color3D = {
            hover: this.$3d.param.meshHoverColor,
            active: this.$3d.param.meshActiveColor
        };
        var color2D = {
            active: this.$2d.param.meshActiveColor,
            hover: this.$2d.param.meshHoverColor
        };
        var me = this;

        // 清空hover
        if (mesh == null && type === 'hover' && this.hoverMesh != null) {
            clearMeshColor(this.hoverMesh, true);
            this.hoverMesh = null;
            render2D();
            return;
        }

        // 清空active
        if (mesh == null && type === 'active') {
            var del = 0;
            for (var key in this.activeMesh) {
                del++;
                clearMeshColor(this.activeMesh[key]);
                delete this.activeMesh[key];
            }
            if (del > 0) {
                render2D();
            }
            return;
        }

        if (mesh == null) {
            return;
        }

        // 设置hover
        if (type === 'hover') {
            if (this.hoverMesh != null && this.hoverMesh.uuid === mesh.uuid) {
                return;
            }
            if (this.hoverMesh != null && this.hoverMesh.uuid !== mesh.uuid) {
                clearMeshColor(this.hoverMesh, true);
            }
            this.hoverMesh = mesh;
            setMeshColor(mesh, color3D.hover, color2D.hover);
            render2D();
            return;
        }

        // 设置active
        if (type === 'active') {
            if (this.activeMesh[mesh.uuid]) {
                return;
            }
            this.activeMesh[mesh.uuid] = mesh;
            setMeshColor(mesh, color3D.active, color2D.active);
            render2D();
            return;
        }

        // 设置物体颜色
        function setMeshColor(geo, c1, c2) {
            geo.material.setValues({color: c1});
            var geo2d = me.$2d.children[geo.uuid];
            if (geo2d) {
                me.$2d.children[geo.uuid].renderColor =c2;
            }
        }

        /**
         * 还原mesh为本色或者active颜色
         *
         * @param {Object} geo 3D物体
         * @param {boolean} active 是否将物体还原成激活状态颜色，如果这个物体是激活的
         */
        function clearMeshColor(geo, active) {
            var c1 = geo[window.editorKey].color;
            var geo2d = me.$2d.children[geo.uuid];
            var c2 = geo2d ? geo2d.color : '#000';
            if (me.activeMesh[geo.uuid] && active) {
                c1 = color3D.active;
                c2 = color2D.active;
            }
            setMeshColor(geo, c1, c2);
        }

        // 刷新2D舞台
        function render2D() {
            if (me.type === '$2d') {
                me.$2d.renderMesh();
            }
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
        if (!mesh.hasOwnProperty(window.editorKey)) {
            mesh[window.editorKey] = {};
        }
        if (!mesh[window.editorKey].hasOwnProperty('color')) {
            mesh[window.editorKey].color = mesh.material.color.getHex();
        }
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
     * 删除舞台中所有物体
     */
    Stage.prototype.removeAll = function () {
        for (var key in this.$3d.children) {
            this.remove(key);
        }
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
            for (var key in this.activeMesh) {
                this.$2d.children[key].renderColor = this.$2d.param.meshActiveColor;
            }
            this.$2d.renderMesh();
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
