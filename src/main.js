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


    const config = require ('./config');
    const App = require('./App.jsx');
    const dispatcher = require('./dispatcher/index');
    const model = require('./core/model');


    let defaultLight = new THREE.PointLight(0xffffff);
    defaultLight.position.set(0, 2000, 0);
    defaultLight.tc = {
        birth: new Date(),
        add: true
    };


    model.fill(config);


    // 这些数据需要从localStorage里读出来，或者从文件里读出来
    model.fill({

        // 系统稳定态时间戳
        timer: 0,

        // 本地文件系统的目录前缀
        rootPrefix: '/__tceditor__',
        // 本地文件系统的目录
        root: '',
        // 当前打开的文件绝对路径
        path: '',
        // 保存时的模型压缩等级：0，不压缩；2，vectory保留两位小数；4，vectory保留四位小数
        compressMode: 2,

        // 舞台中的物体hash
        mesh3d: {},
        // 舞台中的灯光hash
        lights: {defaultLight: defaultLight},
        // 当前选中的物体
        selectedMesh: null,
        // 当前选中的物体的关节
        selectedVector: null,
        // 当前选中的物体关节的索引号
        selectedVectorIndex: -1,
        // 当前选中的灯光
        selectedLight: null,

        // 当前激活的分组，物体默认会被添加到这个分组里
        activeGroup: 'default group',
        // 右侧处于显示状态的工作卡片
        panel: [
            {type: 'meshPanel', expend: true},
            // {type: 'geoEditor', expend: true}
            {type: 'mtlEditor', expend: true}
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
                cameraRadius: 2500,
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
            gridSize3D: 5000,
            // 舞台中3D网格单元格大小
            gridStep3D: 50
        },
        // 当前鼠标的3D位置
        mouse3d: {x: 0, y: 0, z: 0},
        // 编辑器当前显示模式
        view: 'view-all',
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
        if (store.path.length) {
            document.title = config.editorTitle + ' ' +store.path.split('/').pop();
        }
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
