/**
 * @file 3D舞台
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['three'], function (THREE) {

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
    Stage3D.prototype.setCameraPosition = function () {
        var cameraAngleA = this.param.cameraAngleA;
        var cameraAngleB = this.param.cameraAngleB;
        var cameraRadius = this.param.cameraRadius;
        var cameraLookAt = this.param.cameraLookAt;
        var gridContainer = this.helper.gridContainer;
        var grid = this.helper.grid;
        var y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        var x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        var z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        if (Math.abs(cameraAngleA) < 5) {
            gridContainer.rotation.z = grid.rotation.z = Math.PI * 0.5 - Math.PI * cameraAngleB / 180;
            gridContainer.rotation.x = grid.rotation.x = Math.PI * 1.5;
            this.param.gridLocked = false;
        } else {
            gridContainer.rotation.z = grid.rotation.z = 0;
            gridContainer.rotation.x = grid.rotation.x = 0;
            this.param.gridLocked = true;
        }
        this.camera.position.set(
            x + cameraLookAt.x,
            y + cameraLookAt.y,
            z + cameraLookAt.z
        );
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
            gridLocked: true
        };
        // 辅助对象
        this.helper = {
            // dom容器
            domElememt: param.container,
            // 射线，用于鼠标拾取物体
            raycaster: new THREE.Raycaster(),
            // 网格的容器，主要作用是接受对网格的操作
            gridContainer: new THREE.Object3D(),
            // 网格
            grid: new THREE.GridHelper(this.param.gridSize, this.param.gridStep),
            // 坐标轴
            axis: new THREE.AxisHelper(200),
            // 坐标纸
            plane: new THREE.Mesh(
                new THREE.PlaneBufferGeometry(10000, 10000, 1, 1),
                new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide})
            )
        };
        // 鼠标位置缓存
        this.mouse2d = new THREE.Vector3();
        this.mouse3d = new THREE.Vector3();
        // 自定义事件
        this.events = {};
        // 舞台中物体hash
        this.children = {};
        // 需要传递animate动作的插件
        this.plugin = {}
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
        this.scene.add(this.helper.gridContainer);
        this.helper.gridContainer.add(this.helper.plane);
        this.helper.grid.setColors(this.param.gridColor, this.param.gridColor);
        this.renderer.setClearColor(this.param.clearColor);
        this.renderer.setSize(this.param.width, this.param.height);
        this.helper.plane.rotation.x = Math.PI * 0.5;
        this.helper.plane.visible = false;
        this.helper.domElememt.appendChild(this.renderer.domElement);
        this.setCameraPosition();
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