/**
 * @file 主启动
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var THREE = require('three');
    var ReactDOM = require('react-dom');
    var React = require('react');
    var _ = require('underscore');


    var config = require ('./config');
    var App = require('./App.jsx');
    var dispatcher = require('./common/dispatcher');
    var model = require('./common/model');
    

    model.fill(config);
    // 这些数据需要从localStorage里读出来，或者从文件里读出来
    model.fill({
        // 舞台中的物体hash
        mesh3d: {},
        // 舞台中的灯光hash
        lights: {},
        // 当前选中的物体
        selectedMesh: null,
        // 当前选中的物体的关节
        selectedVector: null,
        // 右侧处于显示状态的工作卡片
        panel: [
            {type: 'meshPanel', expend: true}
        ],
        // 物体分组信息
        group: [
            {label: 'default group', expend: true}
        ],
        // 舞台配置信息
        stage: {
            // 舞台背景色
            colorStage: ['#3D3D3D', 0x3d3d3d],
            // 舞台坐标纸颜色
            colorGrid: ['#8F908A', 0x8F908A],
            // 3D摄像机配置
            camera3D: {
                // 摄像机到期观察点的距离，可以理解为焦距
                cameraRadius: 1000,
                // 摄像机视线与XOZ平面夹角
                cameraAngleA: 40,
                // 摄像机视线在XOZ平面投影与X轴夹角
                cameraAngleB: 45,
                // 摄像机观察点
                lookAt: {x: 0, y: 0, z: 0}
            },
            // 舞台中网格是否显示
            gridVisible: true,
            // 舞台中3D网格大小
            gridSize3D: 2500,
            // 舞台中3D网格单元格大小
            gridStep3D: 50
        },
        // 当前鼠标的3D位置
        mouse3d: {x: 0, y: 0, z: 0},
        // 编辑器当前显示模式
        view: 'view-3d',
        // 编辑器当前处于响应拖拽事件的命令
        tool: 'camera-move',
        // 变形工具工作状态
        transformer3Dinfo: {
            mode: 'translate',
            size: 1,
            space: 'world'
        },
        // 修改工具工作状态
        morpher3Dinfo: {
            anchorColor: 0x00CD00,
            anchorSize: 1000
        }
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
