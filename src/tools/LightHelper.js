/**
 * @file 灯光辅助器
 * @author Haitao Li
 * @mail 279641976@qq.com
 */

import * as THREE from 'three';
import TransformControls from 'dep/TransformControls';

function controllerChangeHandler(e) {
    const anchor = e.target.object;
    const light = this.lights[anchor.tc.lightKey];
    if (!light) return;
    light.position.set(anchor.position.x, anchor.position.y, anchor.position.z);
}


function removeAnchors(me) {
    const {anchors, scene} = me;
    Object.keys(anchors).map(key => {
        scene.remove(anchors[key]);
    });
}


export default class LightHelper {

    constructor(param) {
        Object.assign(this, param, {
            controller: new TransformControls(param.camera, param.renderer.domElement),
            anchors: {},
            anchorArray: []
        });
        this.controller.addEventListener('objectChange', controllerChangeHandler.bind(this));
    }

    attach(lights) {
        const {scene, anchors, camera} = this;
        const anchorArray = [];
        this.lights = lights ? lights : this.lights;
        removeAnchors(this);
        Object.keys(this.lights).map(key => {
            const item = this.lights[key];
            const anchor = anchors[item.uuid] ? anchors[item.uuid] : new THREE.Mesh(
                new THREE.SphereGeometry(20, 20, 20),
                new THREE.MeshBasicMaterial({color: 0xffaa00})
            );
            anchors[key] = anchor;
            anchor.material.color.setHex(item.color.getHex());
            anchor.position.set(item.position.x, item.position.y, item.position.z);
            anchor.scale.x = anchor.scale.y = anchor.scale.z = item.position.distanceTo(camera.position) / 2000;
            anchor.tc = {
                materialColor: item.color.getHex(),
                lightKey: key
            };
            scene.add(anchor);
            anchorArray.push(anchor);
        });
        this.anchorArray = anchorArray;
    }

    update() {
        const {camera, anchors} = this;
        Object.keys(anchors).map(key => {
            const item = anchors[key];
            item.scale.x = item.scale.y = item.scale.z = item.position.distanceTo(camera.position) / 2000;
        });
    }

    detach() {
        removeAnchors(this);
        this.anchorArray = [];
    }

}
