/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    const THREE = require('three');
    const ReactDOM = require('react-dom');
    const React = require('react');
    const _ = require('underscore');


    const emptyEditor = require('./emptyEditor');
    const config = require ('./config');
    const App = require('./App.jsx');
    const dispatcher = require('./dispatcher/index');
    const model = require('./core/model');
    const hotkey = require('./core/hotkey');


    model.fill(config);
    model.fill(emptyEditor);
    model.onChange = function (store) {
        render(store);
    };
    render(model.store);


    function render(store) {
        if (store.path.length) {
            document.title = config.editorTitle + ' ' +store.path.split('/').pop();
        }
        let props = _.extend({}, store, {dispatch: dispatch});
        ReactDOM.render(React.createElement(App, props), document.getElementById('main'));
    }


    function dispatch() {
        if (arguments.length === 0) return;
        var args = [].slice.apply(arguments);
        var handler = args.shift();
        if (typeof handler !== 'string') {
            args.unshift(handler);
            handler = typeof handler.type === 'string' ? handler.type : '';
        }
        if (typeof dispatcher[handler] === 'function') {
            return dispatcher[handler].apply(model, args);
        }
    }


    function moveCameraByKeyboard(angle, direction) {
        let stage = JSON.parse(JSON.stringify(model.store.stage));
        stage.camera3D[angle] += direction;
        model.set('stage', stage);
    }


    // 挂接所有快捷键事件
    hotkey.on('escape', function () {
        model.fill({
            selectedMesh: null,
            selectedVector: null,
            selectedVectorIndex: -1
        });
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
});
