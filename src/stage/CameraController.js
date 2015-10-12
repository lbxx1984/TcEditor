/**
 * @file 摄像机控制器
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['three'], function (THREE) {

    // 配置参数
    var info = {
        'font':[20, 0, 0, 0, 0.5, 0, 30, 30, 0],
        'back': [-20, 0, 0, 0, -0.5, 0, 30, 30, 0],
        'top': [0, 20, 0, -0.5, 0, 0, 30, 30, 0],
        'bottom': [0, -20, 0, 0.5, 0, 0, 30, 30, 0],
        'left': [0, 0, 20, 0, 0, 0, 30, 30, 0],
        'right': [0, 0, -20, 0, -1, 0, 30, 30, 0],
        'font_left_top': [17.5, 17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'font_right_top': [17.5, 17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_top_back': [-17.5, 17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'back_top_right': [-17.5, 17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_font_bottom': [17.5, -17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'font_right_bottom': [17.5, -17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_back_bottom': [-17.5, -17.5, 17.5, 0, 0, 0, 5, 5, 5],
        'right_back_bottom': [-17.5, -17.5, -17.5, 0, 0, 0, 5, 5, 5],
        'left_top': [0, 17.5, 17.5, 0, 0, 0, 30, 5, 5],
        'left_bottom': [0, -17.5, 17.5, 0, 0, 0, 30, 5, 5],
        'top_right': [0, 17.5, -17.5, 0, 0, 0, 30, 5, 5],
        'bottom_right': [0, -17.5, -17.5, 0, 0, 0, 30, 5, 5],
        'top_font': [17.5, 17.5, 0, 0, 0, 0, 5, 5, 30],
        'bottom_font': [17.5, -17.5, 0, 0, 0, 0, 5, 5, 30],
        'back_bottom': [-17.5, -17.5, 0, 0, 0, 0, 5, 5, 30],
        'top_back': [-17.5, 17.5, 0, 0, 0, 0, 5, 5, 30],
        'font_left': [17.5, 0, 17.5, 0, 0, 0, 5, 30, 5],
        'font_right': [17.5, 0, -17.5, 0, 0, 0, 5, 30, 5],
        'back_right': [-17.5, 0, -17.5, 0, 0, 0, 5, 30, 5],
        'back_left': [-17.5, 0, 17.5, 0, 0, 0, 5, 30, 5]
    };
    var cmd = {
        'font_left_top': [45, 45],
        'left_top_back': [45, 135],
        'back_top_right': [45, 225],
        'font_right_top': [45, 315],
        'left_font_bottom': [-45, 45],
        'left_back_bottom': [-45, 135],
        'right_back_bottom': [-45, 225],
        'font_right_bottom': [-45, 315],
        'left_top': [45, 90],
        'left_bottom': [-45, 90],
        'top_right': [45, 270],
        'bottom_right': [-45, 270],
        'top_font': [45, 0],
        'bottom_font': [-45, 0],
        'top_back': [45, 180],
        'back_bottom': [-45, 180],
        'font_left': [0, 45],
        'font_right': [0, 315],
        'back_right': [0, 225],
        'back_left': [0, 135],
        'left': [0, 90],
        'right': [0, 270],
        'font': [0, 0],
        'back': [0, 180],
        'top': [89, null],
        'bottom': [-89, null]
    };


    /**
     * 主渲染方法，本控制器的渲染动作由外部心跳方法触发，不自行渲染
     */
    CameraController.prototype.animate = function () {
        this.camera.lookAt(this.param.cameraLookAt);
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 根据摄像机的体态参数换算摄像机位置
     */
   CameraController.prototype.setCameraPosition = function () {
        var cameraRadius = this.param.cameraRadius;
        var cameraAngleA = this.param.cameraAngleA;
        var cameraAngleB = this.param.cameraAngleB;
        var y = cameraRadius * Math.sin(Math.PI * cameraAngleA / 180);
        var x = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.cos(Math.PI * cameraAngleB / 180);
        var z = cameraRadius * Math.cos(Math.PI * cameraAngleA / 180) * Math.sin(Math.PI * cameraAngleB / 180);
        this.camera.position.set(x, y, z);
    };

    /**
     * 控制器插件
     * @constructor
     *
     * @param {Object} param 配置参数
     * @param {number} param.cameraAngleA 摄像机观察线与XOZ平面夹角
     * @param {numner} param.cameraAngleB 摄像机观察线XOZ平面投影，与X轴夹角
     * @param {boolean} param.animate 控制器在切换角度时是否使用动画效果
     * @param {number} param.width 控制器整体宽度
     * @param {numner} param.height 控制器整体高度
     * @param {string} param.language 编辑器的语言种类，涉及到纹理路径
     */
    function CameraController(param) {

        /**控制参数**/
        this.param = {
            // 材质目录
            textureUrl: param.textureUrl || '',
            // 语言
            language: param.language || 'ch',
            // dom
            domElement: param.container,
            // 鼠标选中的物体
            intersected: null,
            // 受该摄像机控制的所有舞台
            stages: [],
            // 是否使用动画效果
            animate: (param.animate == null) ? false : param.animate,
            // 摄像机参数
            cameraRadius: 90,
            cameraAngleA: param.cameraAngleA || 40,
            cameraAngleB: param.cameraAngleB || 45,
            cameraMoveSpeed: 2,
            cameraRotated: false,
            cameraLookAt: {x: 0, y: 0, z: 0},
            // 舞台尺寸
            width: param.width || 120,
            height: param.height || 120,
            // 临时鼠标
            mouse: [0, 0]
        };

        /**舞台参数**/
        this.camera = new THREE.PerspectiveCamera(60, this.param.width / this.param.height, 1, 10000);
        this.scene = new THREE.Scene();
        //this.renderer = new THREE.CanvasRenderer();
        this.renderer = new THREE.WebGLRenderer({
            alpha: true
        });
        this.raycaster = new THREE.Raycaster();

        /**创建控制面*/
        for (var key in info) {
            var mesh = null;
            if (key.indexOf('_') < 0) {
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(info[key][6], info[key][7]),
                    new THREE.MeshLambertMaterial({
                        map: THREE.ImageUtils.loadTexture(
                            this.param.textureUrl + key + '_' + this.param.language + '.png'
                        )
                    })
                );
            } else {
                mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(info[key][6], info[key][7], info[key][8]),
                    new THREE.MeshLambertMaterial({
                        map: THREE.ImageUtils.loadTexture(
                            this.param.textureUrl + 'background.png'
                        )
                    })
                );
            }
            mesh.position.x = info[key][0];
            mesh.position.y = info[key][1];
            mesh.position.z = info[key][2];
            mesh.rotation.x = Math.PI * info[key][3];
            mesh.rotation.y = Math.PI * info[key][4];
            mesh.rotation.z = Math.PI * info[key][5];
            mesh.tid = key;
            this.scene.add(mesh);
        }

        /**初始化舞台*/
        this.param.domElement.appendChild(this.renderer.domElement);
        this.scene.add(new THREE.AmbientLight(0xffffff));
        this.renderer.setSize(this.param.width, this.param.height);
        this.setCameraPosition();
    }

    return CameraController;
});
