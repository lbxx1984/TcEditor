/**
 * @file 灯光辅助器
 * @author Haitao Li
 * @mail 279641976@qq.com
 */
define(function (require) {


    var _ = require('underscore');
    var THREE = require('three');
    var Transformer3D = require('three-lib/TransformControls');

    function anchorFactory() {
        var geometry = new THREE.SphereGeometry(20, 20, 20);
        var material = new THREE.MeshBasicMaterial({color: 0xffaa00});
        return new THREE.Mesh(geometry , material);
    }

    function onControllerChange(e) {
        var anchor = e.target.object;
        var light = this.lights[anchor.tc.lightKey];
        if (!light) return;
        light.position.set(anchor.position.x, anchor.position.y, anchor.position.z);
    }

    function LightHelper(param) {
        this.scene = param.scene;
        this.camera = param.camera;
        this.lights = param.lights;
        this.renderer = param.renderer;
        this.controller = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.anchors = {};
        this.anchorArray = [];
        this.controller.addEventListener('objectChange', onControllerChange.bind(this));
    }


    LightHelper.prototype.attach = function (lights) {
        var scene = this.scene;
        var anchors = this.anchors;
        var camera = this.camera;
        var anchorArray = [];
        this.lights = lights ? lights : this.lights;
        _.each(this.anchors, function (item, key) {
            scene.remove(item);
        });
        _.each(this.lights, function (item, key) {
            var anchor = anchors[item.uuid] ? anchors[item.uuid] : anchorFactory();
            var anchorPos = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
            anchors[item.uuid] = anchor;
            anchor.material.color.setHex(item.color.getHex());
            anchor.position.set(anchorPos.x, anchorPos.y, anchorPos.z);
            anchor.scale.x = anchor.scale.y = anchor.scale.z = anchorPos.distanceTo(camera.position) / 2000;
            anchor.tc = {
                materialColor: item.color.getHex(),
                lightKey: key
            };
            scene.add(anchor);
            anchorArray.push(anchor);
        });
        this.anchorArray = anchorArray;
    };


    LightHelper.prototype.detach = function () {
        var scene = this.scene;
        _.each(this.anchors, function (item, key) {
            scene.remove(item);
        });
        this.anchorArray = [];
    };


    LightHelper.prototype.update = function () {
        var camera = this.camera;
        var anchors = this.anchors;
        _.each(this.lights, function (item) {
            if (!anchors[item.uuid]) return;
            var anchor = anchors[item.uuid];
            var anchorPos = new THREE.Vector3(anchor.position.x, anchor.position.y, anchor.position.z);
            anchor.scale.x = anchor.scale.y = anchor.scale.z = anchorPos.distanceTo(camera.position) / 2000;
        });
    };


    return LightHelper;
});
