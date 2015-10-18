/**
 * @file 3D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {


    /**
     * 获取鼠标下的可见物体
     *
     * @param {Object} e 鼠标事件对象
     * @param {?Array.<Object>} arr 物体数组，如果指定就从数组中查找，不指定从全局查找
     * @return {Object} 3D物体对象 或null
     */
    Stage3D.prototype.getMeshByMouse = function(e, arr) {
        var array = [];
        if (arr instanceof Array) {
            array = arr;
        }
        else {
            for (var key in this.children) {
                if (this.children[key].visible) {
                    array.push(this.children[key]);
                }
            }
        }
        if (array.length === 0) return null;
        var mouse = new THREE.Vector3(
            ((e.layerX - window.scrollX) / this.param.width) * 2 - 1,
            - ((e.layerY - window.scrollY) / this.param.height) * 2 + 1,
            0
        );
        var raycaster = this.helper.raycaster;
        raycaster.setFromCamera(mouse, this.camera);
        var intersects = raycaster.intersectObjects(array);
        if (intersects.length > 0) {
            return intersects[0].object;
        }
        return null;
    };


    /**
     * 设置摄像机观察点，相当于平移摄像机
     *
     * @param {number} dx 横向移动增量
     * @param {number} dy 纵向移动增量
     */
    Stage3D.prototype.cameraLookAt = function (dx, dy) {
        var param = this.param;
        var lookat = param.cameraLookAt;
        var cpos = this.camera.position;
        var hpos = this.helper.planeContainer.position;
        dx = param.cameraRadius * dx * param.cameraMoveSpeed * 0.2 / param.width;
        dy = param.cameraRadius * dy * param.cameraMoveSpeed * 0.2 / param.height;
        if (Math.abs(param.cameraAngleA) > 2) {
            lookat.x -= Math.sin(Math.PI * param.cameraAngleB / 180) * dx;
            lookat.z += Math.cos(Math.PI * param.cameraAngleB / 180) * dx;
            lookat.x -= Math.cos(Math.PI * param.cameraAngleB / 180) * dy * Math.abs(cpos.y) / cpos.y;
            lookat.z -= Math.sin(Math.PI * param.cameraAngleB / 180) * dy * Math.abs(cpos.y) / cpos.y;
        }
        else {
            lookat.x -= Math.sin(Math.PI * param.cameraAngleB / 180) * dx;
            lookat.z += Math.cos(Math.PI * param.cameraAngleB / 180) * dx;
            lookat.y += dy;
        }
        hpos.x = lookat.x;
        hpos.y = lookat.y;
        hpos.z = lookat.z;
        this.updateCameraPosition();
    };


    /**
     * 缩放舞台
     *
     * @param {Object} e 鼠标wheel事件 
     */ 
    Stage3D.prototype.mousewheel = function(event) {
        var param = this.param;
        this.zoomCamera(- 0.2 * param.cameraRadius * event.wheelDelta * param.cameraMoveSpeed / param.width);
    };


    /**
     * 获取鼠标的空间位置，投射在虚拟坐标纸上的位置
     *
     * @param {number} x 鼠标在当前舞台中的x坐标, 对应layerX
     * @param {number} y 鼠标在当前舞台中的y坐标, 对应layerY
     */
    Stage3D.prototype.getMouse3D = function (x, y) {
        var me = this;
        var mouse = new THREE.Vector3(
            ((x - window.scrollX) / me.param.width) * 2 - 1,
            - ((y - window.scrollY) / me.param.height) * 2 + 1,
            0
        );  
        var raycaster = me.helper.raycaster;
        raycaster.setFromCamera(mouse, me.camera);
        var intersects = raycaster.intersectObjects([me.helper.plane]);
        var point = new THREE.Vector3();
        if (intersects.length > 0) {
            point = intersects[0].point;
            if (Math.abs(point.x) < 5) {
                point.x = 0;
            }
            if (Math.abs(point.y) < 5) {
                point.y = 0;
            }
            if (Math.abs(point.z) < 5) {
                point.z = 0;
            }
        }
        return point.clone();
    };


    /**
     * 切换坐标轴和网格的显示隐藏状态
     */
    Stage3D.prototype.toggleHelper = function () {
        var param = this.param;
        var helper = this.helper;
        param.showGrid = helper.axis.visible = helper.grid.visible = !param.showGrid;
    };


    /**
     * 改变网格大小
     *
     * @param {boolean} enlarge true放大；false缩小 
     */
    Stage3D.prototype.resizeGrid = function (enlarge) {
        var param = this.param;
        var helper = this.helper;
        if (enlarge) {
            param.gridSize = Math.min(param.gridSize + 1000, 20000);
        } else {
            param.gridSize = Math.max(param.gridSize - 1000, 1000);
        }
        this.scene.remove(helper.grid);
        helper.grid = new THREE.GridHelper(param.gridSize, param.gridStep);
        helper.grid.setColors(param.gridColor, param.gridColor);
        helper.grid.visible = param.showGrid;
        this.scene.add(helper.grid);
    };


    /**
     * 改变摄像机焦距
     *
     * @param {boolean | number} dx true推近；false拉远；number具体值
     */
    Stage3D.prototype.zoomCamera = function (dx) {
        var value = 0;
        if (dx === true) {
            value = -360;
        }
        else if (dx === false) {
            value = 360;
        }
        else {
            value = dx;
        }
        value += this.param.cameraRadius;
        value = Math.max(value, 50);
        value = Math.min(value, 5000);
        this.setCamera({r: value});
    };


    /**
     * 设置摄像机位置
     *
     * @param {Object} p 摄像机位置配置
     * @param {number} p.a 对应cameraAngleA
     * @param {number} p.b 对应cameraAngleB
     */
    Stage3D.prototype.setCamera = function (p) {
        if (p == null) {
            return;
        }
        if (p.a != null) {
            this.param.cameraAngleA = p.a;
        }
        if (p.b != null) {
            this.param.cameraAngleB = p.b;
        }
        if (p.r != null) {
            this.param.cameraRadius = p.r;
        }
        this.updateCameraPosition();
    };


    /**
     * 修改编辑器大小
     *
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    Stage3D.prototype.resize = function (width, height) {
        this.param.width = width;
        this.param.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };


    /**
     * 设置摄像机位置
     */
    Stage3D.prototype.updateCameraPosition = function () {
        var cameraAngleA = this.param.cameraAngleA;
        var cameraAngleB = this.param.cameraAngleB;
        var cameraRadius = this.param.cameraRadius;
        var cameraLookAt = this.param.cameraLookAt;
        var planeContainer = this.helper.planeContainer;
        var grid = this.helper.grid;
        var y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        var x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        var z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        if (Math.abs(cameraAngleA) < 2) {
            planeContainer.rotation.z = grid.rotation.z = Math.PI * 0.5 - Math.PI * cameraAngleB / 180;
            planeContainer.rotation.x = grid.rotation.x = Math.PI * 1.5;
            this.param.gridLocked = false;
        }
        else {
            planeContainer.rotation.z = grid.rotation.z = 0;
            planeContainer.rotation.x = grid.rotation.x = 0;
            this.param.gridLocked = true;
        }
        this.camera.position.set(
            x + cameraLookAt.x,
            y + cameraLookAt.y,
            z + cameraLookAt.z
        );
        // 渲染插件
        var update = this.updateWithCamera;
        for (var key in update) {
            if (
                update.hasOwnProperty(key)
                && update[key] != null
                && typeof update[key].update === 'function'
            ) {
                update[key].update();
            }
        }
    };


    /*
     * 3D舞台插件构造函数
     * @constructor
     *
     * @param {Object} param 配置参数
     * @param {number} param.cameraRadius 摄像机到期观察点的距离，可以理解为焦距
     * @param {number} param.cameraAngleA 摄像机视线与XOZ平面夹角
     * @param {number} param.cameraAngleB 摄像机视线在XOZ平面投影与X轴夹角
     * @param {Object} param.cameraLookAt 摄像机的观察点，3D坐标
     * @param {number} param.width 舞台宽度
     * @param {number} param.height 舞台高度
     * @param {string} param.clearColor 编辑器背景颜色
     * @param {boolean} param.showGrid 是否显示网格
     * @param {string} param.gridColor 网格的颜色
     * @param {number}
     */
    function Stage3D(param) {

        /**初始化参数**/
        var me = this;
        // 舞台显示状态
        this.display = true;
        // 控制参数
        this.param = {
            // 摄像机参数
            cameraRadius: param.cameraRadius || 2000,
            cameraAngleA: param.cameraAngleA || 40,
            cameraAngleB: param.cameraAngleB || 45,
            cameraLookAt: param.cameraLookAt || {x: 0, y: 0, z: 0},
            cameraMoveSpeed: 2,
            // 舞台参数
            width: param.width || 1000,
            height: param.height || 800,
            clearColor: (param.clearColor == null) ? 0xffffff : param.clearColor,
            // 网格和坐标轴参数
            showGrid: (param.showGrid == null) ? false : true,
            gridColor: (param.gridColor == null) ? 0xffffff : param.gridColor,
            gridSize: 2000,
            gridStep: 100,
            gridLocked: true,
            // 物体参数
            meshActiveColor: (param.meshActiveColor == null) ? 0xD97915 : param.meshActiveColor,
            meshHoverColor: (param.mesnHoverColor == null) ? 0xffff00 : param.meshHoverColor
        };
        // 辅助对象
        this.helper = {
            // dom容器
            domElement: param.container,
            // 射线，用于鼠标拾取物体
            raycaster: new THREE.Raycaster(),
            // 网格
            grid: new THREE.GridHelper(this.param.gridSize, this.param.gridStep),
            // 坐标轴
            axis: new THREE.AxisHelper(200),
            // 坐标纸
            plane: new THREE.Mesh(
                new THREE.PlaneGeometry(10000, 10000, 1, 1),
                new THREE.MeshBasicMaterial({visible: false,side: THREE.DoubleSide})
            ),
            // 网格的容器，主要作用是接受对网格的操作
            planeContainer: new THREE.Object3D()
        };
        // 自定义事件
        this.events = {};
        // 舞台中物体hash
        this.children = {};
        // 需要传递animate动作的插件
        this.plugin = {}
        // 摄像机移动后需要更新的插件，并非每帧都要更新
        this.updateWithCamera = {};
        // 3D摄像机
        this.camera = new THREE.PerspectiveCamera(60, this.param.width / this.param.height, 1, 20000);
        // 3D场景
        this.scene = new THREE.Scene();
        // WebGL渲染器
        this.renderer = new THREE.WebGLRenderer({antialias: true});

        /**初始化3D场景**/
        if (this.param.showGrid) {
            this.scene.add(this.helper.grid);
            this.scene.add(this.helper.axis);
        }
        this.helper.plane.rotation.x = Math.PI * 0.5;
        this.helper.planeContainer.add(this.helper.plane);
        this.scene.add(this.helper.planeContainer);
        this.helper.grid.setColors(this.param.gridColor, this.param.gridColor);
        this.renderer.setClearColor(this.param.clearColor);
        this.renderer.setSize(this.param.width, this.param.height);
        this.helper.domElement.appendChild(this.renderer.domElement);
        this.updateCameraPosition();

        var light = new THREE.PointLight(0xffffff, 1.5, 3000);
        light.position.set(0, 900, 0);
        this.scene.add(light);

        animate();

        /**场景渲染**/
        function animate() {
            requestAnimationFrame(animate);
            if (!me.display) {
                return;
            }
            // 渲染内部
            me.camera.lookAt(me.param.cameraLookAt);
            me.renderer.render(me.scene, me.camera);
            // 渲染插件
            for (var key in me.plugin) {
                if (me.plugin.hasOwnProperty(key) && typeof me.plugin[key].animate === 'function') {
                    me.plugin[key].animate();
                }
            }
        }
    }


    return Stage3D;
});