define(['./tool', './mouse', './create'], function (tool, mouse, create) {


    /**
     * @constructor
     */
    function Routing(cmd) {
        // UI对象
        this.ui = null;
        // 舞台对象
        this.stage = null;
        // 引擎集合
        this.engines = {
            tool: tool,
            mouse: mouse,
            create: create
        };
        // 当前处于激活状态的引擎，一般用来处理鼠标事件
        this.currentEngine = null;
        // 针对引擎制定的二层处理单元
        this.currentProcessor = null;
        // 执行默认命令
        this.main(cmd);
    }


    /**
     * 命令输入接口
     */
    Routing.prototype.main = function (cmd) {
        if (typeof cmd !== 'string') {
            return;
        }
        var cmds = cmd.split('-');
        var engines = this.engines;
        if (cmds.length === 2 && engines.hasOwnProperty(cmds[0])) {
            var engine = engines[cmds[0]];
            // click命令，执行完毕后不保存状态
            if (typeof engine[cmds[1]] === 'function') {
                engine[cmds[1]].apply(this, arguments);
                return;
            }
            // 切换处理引擎
            this.currentEngine = engine;
            // 切换引擎处理单元
            this.currentProcessor = cmds[1];
            // 引擎初始化
            this.callEngine('loaded', null);
        }
        else {
            console.warn('No engine for command "' + cmd + '"');
        }
    };


    /**
     * 调用引擎
     *
     * @param {string} func 三级方法名
     * @param {Object} e 灌入的参数
     */
    Routing.prototype.callEngine = function (func, e) {
        var engine = this.currentEngine;
        var processor = this.currentProcessor;
        if (
            engine == null
            || processor == null
            || !engine.hasOwnProperty(processor)
            || typeof engine[processor][func] !== 'function'
        ) {
            return;
        }
        engine[processor][func].call(this, e);
    };


    /**
     * 鼠标事件分发
     */
    Routing.prototype.mouseup = function (e) {
        this.callEngine('mouseup', e);
    };
    Routing.prototype.mousedown = function (e) {
        this.callEngine('mousedown', e);
    };
    Routing.prototype.mousemove = function (e) {
        if (
            this.stage == null
            || this.ui == null
            || this.stage.cameraController.param.cameraRotated
        ) {
            return;
        }
        var pos = this.stage.getMouse3D(e.layerX, e.layerY);
        this.ui.refs.containerright.setState({
            mouse3d: {x: parseInt(pos.x, 10), y: parseInt(pos.y, 10), z: parseInt(pos.z, 10)}
        });
        this.callEngine('mousemove', e);
    };


    return Routing;
});