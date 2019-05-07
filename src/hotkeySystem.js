/**
 * @file 快捷键挂载系统
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import hotkey from 'core/hotkey';

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

    hotkey.on('f1,ctrl + h', function () {
        dispatcher['popHotkeyInfo'].apply(model);
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
        dispatcher['openFile'].apply(model);
    });

    hotkey.on('ctrl + s', function () {
        dispatcher['saveFile'].apply(model);
    });

    hotkey.on('ctrl + shift + s', function () {
        dispatcher['saveFileAs'].apply(model);
    });

    hotkey.on('ctrl + shift + i', function () {
        dispatcher['importFile'].apply(model);
    });

    hotkey.on('ctrl + shift + o', function () {
        dispatcher['exportFile'].apply(model);
    });

    hotkey.on('alt + digit1', function () {
        dispatcher['changeView'].apply(model, ['3d']);
    });

    hotkey.on('alt + digit2', function () {
        dispatcher['changeView'].apply(model, ['xoz']);
    });

    hotkey.on('alt + digit3', function () {
        dispatcher['changeView'].apply(model, ['xoy']);
    });

    hotkey.on('alt + digit4', function () {
        dispatcher['changeView'].apply(model, ['zoy']);
    });

    hotkey.on('alt + digit5', function () {
        dispatcher['changeView'].apply(model, ['all']);
    });

    hotkey.on('ctrl + d', function () {
        dispatcher['pickMesh'].apply(model);
    });

    hotkey.on('ctrl + f', function () {
        dispatcher['pickJoint'].apply(model);
    });

    hotkey.on('ctrl + g', function () {
        dispatcher['pickLight'].apply(model);
    });

    hotkey.on('ctrl + e', function () {
        dispatcher['moveCamera'].apply(model);
    });

    hotkey.on('alt + q', function () {
        let mode = model.store.transformer3Dinfo.mode === 'translate' ? 'rotate' : 'translate';
        dispatcher['setTransformerMode'].apply(model, [mode]);
    });

}
