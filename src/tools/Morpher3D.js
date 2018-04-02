/**
 * 3D骨骼编辑器
 */

import * as THREE from 'three';
import {world2local, getRotateMatrix, local2world} from 'core/math';


function clearAnchors(me) {
    me.anchors.map(anchor => {
        if (!anchor.added) return;
        anchor.added = false;
        me.scene.remove(anchor);
    });
}

function controllerChangeHandler() {
    if (!this.vector || !this.mesh) return;
    const {vector, mesh, anchorSize, renderer, camera} = this;
    const width = renderer.domElement.offsetWidth;
    const pos = world2local(vector.position.x, vector.position.y, vector.position.z, mesh);
    const indexArr = mesh.tc.vectorLinkHash && mesh.tc.vectorLinkHash[vector.index]
        ? [vector.index].concat(mesh.tc.vectorLinkHash[vector.index]) : [vector.index];
    const vertices = mesh.geometry.vertices;
    indexArr.map(i => {
        vertices[i].x = pos[0];
        vertices[i].y = pos[1];
        vertices[i].z = pos[2];
    });
    mesh.geometry.verticesNeedUpdate = true;
    vector.scale.x = vector.scale.y = vector.scale.z
        = 1500 * camera.position.distanceTo(vector.position) / anchorSize / width;
}


export default class Morpher3D {

    constructor(param) {
        Object.assign(this, param, {
            mesh: null,
            vector: null,
            anchors: [],
            controller: new THREE.TransformControls(param.camera, param.renderer.domElement)
        });
        this.controller.addEventListener('objectChange', controllerChangeHandler.bind(this));
    }

    attach(mesh) {
        if (!mesh) return;
        this.mesh = mesh;
        this.vector = null;
        clearAnchors(this);
        const camerapos = this.camera.position;
        const matrix = getRotateMatrix(mesh);
        const vertices = mesh.geometry.vertices;
        const {anchors, scene, anchorSize, anchorColor, renderer} = this;
        const width = renderer.domElement.offsetWidth;
        let attachedAnchors = [];
        vertices.map((ver, index) => {
            const pos = local2world(ver.x, ver.y, ver.z, matrix, mesh);
            const meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            let np = null;
            if (index === anchors.length) {
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: new THREE.TextureLoader().load('resource/textures/sprites/disc.png'),
                    color: anchorColor
                });
                np = new THREE.Sprite(spriteMaterial);
                np.tc = {
                    materialColor: np.material.color.getHex(),
                    index: index
                };
                anchors.push(np);
            }
            else {
                np = anchors[index];
            }
            np.index = index;
            np.position.x = pos[0];
            np.position.y = pos[1];
            np.position.z = pos[2];
            np.scale.x = np.scale.y = np.scale.z = (36 - width / 80) * meshpos.distanceTo(camerapos) / anchorSize;
            if (attachedAnchors.indexOf(index) > -1) {
                return;
            }
            np.added = true;
            scene.add(np);
            attachedAnchors = [].concat(attachedAnchors, [index], mesh.tc.vectorLinkHash[index]);
        });
    }

    detach() {
        this.mesh = null;
        this.vector = null;
        clearAnchors(this);
    }

    attachAnchor(mesh) {
        this.controller.attach(mesh);
        this.vector = mesh;
    }

    detachAnchor() {
        this.controller.detach();
        this.vector = null;
    }

    updateAnchors() {
        const camerapos = this.camera.position;
        const anchorSize = this.anchorSize;
        const width = this.renderer.domElement.offsetWidth;
        this.anchors.map(anchor => {
            if (!anchor.added) return;
            anchor.scale.x = anchor.scale.y = (36 - width / 100) * camerapos.distanceTo(anchor.position) / anchorSize;
        });
    }

    setAnchorColor(color) {
        this.anchors.map(anchor => {
            anchor.tc.materialColor = color;
            anchor.material.setValues({color: color});
        });
    }

    setAnchorSize(size) {
        size = Math.min(size, 1000);
        size = Math.max(size, 500);
        this.anchorSize = size;
        this.updateAnchors();
    }

}