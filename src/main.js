/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var ReactDOM = require('react-dom');
    var React = require('react');
    var _ = require('underscore');

    var config = require ('./config');
    var App = require('./App.jsx');
    var dispatcher = require('./common/dispatcher');
    var model = require('./common/model');


    model.fill(config);
    // 这些数据需要从local storage里读出来，或者从文件里读出来
    model.fill({
        mesh3d: [],
        panel: [
            {type: 'meshPanel', expend: true}
        ],
        stage: {
            colorStage: ['#3D3D3D', 0x3d3d3d],
            colorGrid: ['#8F908A', 0x8F908A],
            camera3D: {
                cameraRadius: 1000,
                cameraAngleA: 40,
                cameraAngleB: 45,
                lookAt: {x: 0, y: 0, z: 0}
            },
            gridVisible: true,
            gridSize3D: 2500,
            gridStep3D: 50
        },
        mouse3d: {x: 0, y: 0, z: 0},
        view: 'view-3d',
        tool: 'camera-move',
    });
    model.onChange = function (store) {
        render(store);
    };
    render(model.store);


    function render(store) {
        var props = _.extend({}, store, {dispatch: dispatch});
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

});
