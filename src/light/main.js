/**
 * @file 灯光系统
 */
define(function (require) {


    /**
     * @constructor
     */
    function Light(param) {
        var me = this;
        this.stage = param.stage.$3d;
        this.ui = param.ui;
        this.hoverColor = param.hoverColor || 0xffff00;
        this.helper = new THREE.TransformControls(this.stage.camera, this.stage.renderer.domElement);
        this.helper.addEventListener('objectChange', changeHandler);
        this.hoverAnchor = '';
        this.attached = null;
        this.baseRule = 1000;
        this.children = {};
        this.anchors = {};
        this.anchorsArray = [];
        /* 灯光移动处理 */
        function changeHandler() {
            if (me.attached == null) {
                return;
            }
            var light = me.children[me.attached.uuid];
            var pos = me.attached.position;
            light.position.set(pos.x, pos.y, pos.z);
            var r = me.stage.camera.position.distanceTo(pos) / me.baseRule;
            me.attached.scale.x = me.attached.scale.y = me.attached.scale.z = r;
        }
    }


    /**
     * 绑定灯光控制器
     */
    Light.prototype.attach = function (mesh) {
        this.attached = mesh;
        this.helper.attach(mesh);
        this.stage.scene.add(this.helper);
        this.stage.updateWithCamera.lightHelper = this.helper;
        this.helper.update();
    };


    /**
     * 解绑灯光控制器
     */
    Light.prototype.detach = function () {
        this.attached = null;
        this.helper.detach();
        this.stage.scene.remove(this.helper);
        this.stage.updateWithCamera.lightHelper = null;
    };


    /**
     * 添加灯光
     */
    Light.prototype.add = function (light) {

        if (!light.hasOwnProperty('birth')) {
            light.locked = false;
            light.birth = new Date().getTime();
        }
        this.stage.scene.add(light);

        var anchor =  new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshBasicMaterial({color: light.color})
        );
        anchor.uuid = light.uuid;
        anchor.locked = light.locked;
        anchor.visible = light.visible;
        anchor.position.set(light.position.x, light.position.y, light.position.z);
        anchor.added = false;
        anchor.__normalColor__ = anchor.material.color.getHex();
        if (this.ui.refs.containerleft.refs.controlbar.state.systemtool === 'picklight') {
            anchor.added = true;
            this.stage.scene.add(anchor);
        }
        
        this.children[light.uuid] = light;
        this.anchors[light.uuid] = anchor;
        this.update();
        this.anchorsArray = [];
        for (var key in this.anchors) {
            this.anchorsArray.push(this.anchors[key]);
        }
    };


    /**
     * 卸载灯光
     */
    Light.prototype.remove = function (uuid) {
        if (this.attached && this.attached.uuid === uuid) this.detach();
        this.stage.scene.remove(this.children[uuid]);
        this.stage.scene.remove(this.anchors[uuid]);
        delete this.children[uuid];
        delete this.anchors[uuid];
        this.anchorsArray = [];
        for (var key in this.anchors) {
            this.anchorsArray.push(this.anchors[key]);
        }
    };


    /**
     * 删除所有灯光
     */
    Light.prototype.removeAll = function () {
        for (var key in this.children) {
            this.remove(key);
        }
    };


    /**
     * 显示操作锚
     */
    Light.prototype.show = function () {
        for (var key in this.anchors) {
            var anchor = this.anchors[key];
            anchor.added = true;
            this.stage.scene.add(anchor);
        }
        this.stage.updateWithCamera.light = this;
        this.update();
    };


    /**
     * hover锚点
     */
    Light.prototype.hover = function (uuid) {
        if (this.hoverAnchor !== '') {
            var anchor = this.anchors[this.hoverAnchor];
            anchor.material.setValues({color: anchor.__normalColor__});
            this.hoverAnchor = '';
        }
        if (this.anchors[uuid]) {
            this.hoverAnchor = uuid;
            anchor = this.anchors[this.hoverAnchor];
            anchor.material.setValues({color: this.hoverColor});
        }
    };


    /**
     * 隐藏操作锚
     */
    Light.prototype.hide = function () {
        for (var key in this.anchors) {
            var anchor = this.anchors[key];
            anchor.added = false;
            this.stage.scene.remove(anchor);
        }
        this.stage.updateWithCamera.light = null;
    };


    /**
     * 更新锚大小
     */
    Light.prototype.update = function () {
        var camerapos = this.stage.camera.position;
        for (var key in this.anchors) {
            var anchor = this.anchors[key];
            if (!anchor.added) continue;
            var s = camerapos.distanceTo(anchor.position) / this.baseRule;
            anchor.scale.x = anchor.scale.y = anchor.scale.z = s; 
        }
    };


    return Light;
});
