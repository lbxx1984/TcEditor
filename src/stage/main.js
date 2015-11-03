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
     */
    Stage.prototype.toogleMeshProp = function(uuid, prop) {
        var v = !this.$3d.children[uuid][prop];
        this.$3d.children[uuid][prop] = v;
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

        var editorKey = '__tceditor__';
        var color3D = {
            hover: this.$3d.param.meshHoverColor,
            active: this.$3d.param.meshActiveColor
        };
        var color2D = {
            normal: this.$2d.param.meshColor,
            active: this.$2d.param.meshActiveColor,
            hover: this.$2d.param.meshHoverColor
        };
        var me = this;

        // 清空hover
        if (mesh == null && type === 'hover' && this.hoverMesh != null) {
            clearMeshColor(this.hoverMesh);
            this.hoverMesh = null;
            render2D();
            return;
        }

        // 清空active
        if (mesh == null && type === 'active') {
            var del = 0;
            for (var key in this.activeMesh) {
                del++;
                setMeshColor(this.activeMesh[key], this.activeMesh[key][editorKey].color, color2D.normal);
                delete this.activeMesh[key];
            }
            if (del > 0) {
                render2D();
            }
            return;
        }

        // 记录物体颜色
        if (mesh == null) {
            return;
        }
        if (!mesh.hasOwnProperty(editorKey)) {
            mesh[editorKey] = {};
        }
        if (!mesh[editorKey].hasOwnProperty('color')) {
            mesh[editorKey].color = mesh.material.color.getHex();
        }

        // 设置hover
        if (type === 'hover') {
            if (this.hoverMesh != null && this.hoverMesh.uuid === mesh.uuid) {
                return;
            }
            if (this.hoverMesh != null && this.hoverMesh.uuid !== mesh.uuid) {
                clearMeshColor(this.hoverMesh);
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
                me.$2d.children[geo.uuid].color =c2;
            }
        }

        // 还原mesh为本色或者active颜色
        function clearMeshColor(geo) {
            var c1 = geo[editorKey].color;
            var c2 = color2D.normal;
            if (me.activeMesh[geo.uuid]) {
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
/*
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

    /***外部接口***/
    /**
     * 设置编辑器背景色
     * @param {string} c CSS形式颜色，如红色：#FF0000
     */
     /*
    _this.setRendererColor = function(c) {
        _renderer.setClearColor(parseInt(c.substr(1), 16));
    }

    /**
     * 设置网格颜色
     * @param {string} e CSS颜色
     */
     /*
    _this.setGridColor = function(e) {
        _gridColor = parseInt(e.substr(1), 16);
        _grid.setColors(_gridColor, _gridColor);
    }
*/