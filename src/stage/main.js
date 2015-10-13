/**
 * @file 舞台系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(['./Stage3D', './CameraController'], function (Stage3D, CameraController) {

    /**
     * @constructor
     * @param {Object} param 初始化参数
     * @param {Object} param.ui application的react对象
     * @param {Object} param.container1 摄像机控制器dom
     * @param {HtmlElement} param.container2 2D舞台dom
     * @param {HtmlElement} param.container3 3D舞台dom
     */
    function Stage(param) {
        this.type = '3d';
        this.ui = param.ui;
        this.container2 = param.container2;
        this.container3 = param.container3;
        // 3D舞台和3D摄像机控制器
        this.$3d = new Stage3D({
            showGrid: true,
            clearColor: 0x2A333A,
            container: param.container3,
            width: param.container3.clientWidth,
            height: param.container3.clientHeight
        });
        var cameraController = new CameraController({
            textureUrl: 'resources/textures/',
            container: param.container1,
            hoverColor: 0xD97915,
            animate: true
        });
        // 绑定摄像机和控制器
        this.$3d.plugin.cameraController = cameraController;
        cameraController.param.stages.push(this.$3d);
    }

    /**
     * resize事件
     */
    Stage.prototype.resize = function () {
        this.$3d.resize(this.container3.clientWidth, this.container3.clientHeight);
    };

    return Stage;
});