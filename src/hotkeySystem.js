/**
 * @file 快捷键挂载系统
 * @author Brian Li
 * @email lbxxlht@163.com
 */


import hotkey from './core/hotkey';


export default function (model, dispatcher) {

    // 键盘公共交互
    function moveCameraByKeyboard(angle, direction) {
        let stage = JSON.parse(JSON.stringify(model.store.stage));
        stage.camera3D[angle] += direction;
        if (angle === 'cameraAngleA') {
            stage.camera3D[angle] = Math.min(stage.camera3D[angle], 89);
            stage.camera3D[angle] = Math.max(stage.camera3D[angle], -89);
        }
        model.set('stage', stage);
    }

    hotkey.on('escape', function () {
        let mesh = model.store.selectedMesh;
        mesh && mesh.material.setValues({color: mesh.tc.materialColor});
        model.fill({
            selectedMesh: null,
            selectedVector: null,
            selectedVectorIndex: -1
        });
    });

    hotkey.on('delete', function () {
        if (!model.store.selectedMesh) return;
        dispatcher['deleteMesh'].apply(model, [model.store.selectedMesh.uuid]);
    });

    hotkey.on('f1', function () {
        dispatcher['help-hotkey'].apply(model);
    });

    hotkey.on('arrowdown', function () {
        moveCameraByKeyboard('cameraAngleA', -1);
    });

    hotkey.on('arrowup', function () {
        moveCameraByKeyboard('cameraAngleA', 1);
    });

    hotkey.on('arrowright', function () {
        moveCameraByKeyboard('cameraAngleB', 1);
    });

    hotkey.on('arrowleft', function () {
        moveCameraByKeyboard('cameraAngleB', -1);
    });

    hotkey.on('ctrl + o', function () {
        dispatcher['file-open'].apply(model);
    });

    hotkey.on('ctrl + s', function () {
        dispatcher['file-save'].apply(model);
    });

    hotkey.on('ctrl + shift + s', function () {
        dispatcher['file-saveAs'].apply(model);
    });

    hotkey.on('ctrl + shift + i', function () {
        dispatcher['file-import'].apply(model);
    });

    hotkey.on('ctrl + shift + e', function () {
        dispatcher['file-export'].apply(model);
    });

    hotkey.on('alt + digit1', function () {
        dispatcher['view-3d'].apply(model);
    });

    hotkey.on('alt + digit2', function () {
        dispatcher['view-xoz'].apply(model);
    });

    hotkey.on('alt + digit3', function () {
        dispatcher['view-xoy'].apply(model);
    });

    hotkey.on('alt + digit4', function () {
        dispatcher['view-zoy'].apply(model);
    });

    hotkey.on('alt + digit5', function () {
        dispatcher['view-all'].apply(model);
    });

    hotkey.on('ctrl + d', function () {
        dispatcher['tool-pickGeometry'].apply(model);
    });

    hotkey.on('ctrl + f', function () {
        dispatcher['tool-pickJoint'].apply(model);
    });

    hotkey.on('ctrl + g', function () {
        dispatcher['tool-pickLight'].apply(model);
    });

    hotkey.on('ctrl + e', function () {
        dispatcher['camera-move'].apply(model);
    });

    hotkey.on('ctrl + r', function () {
        let handler = model.store.transformer3Dinfo.mode === 'translate'
            ? 'transformer-3d-mode-rotate' : 'transformer-3d-mode-translate';
        dispatcher[handler].apply(model);
    });

}
