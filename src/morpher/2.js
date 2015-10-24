/**
 * 骨骼控制器 2D子组成
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * 构造函数
 * @constructor
 * @param {Object} stage 2D编辑器对象，对应Stage2D.js
 * @return {Object} 本控制器对外暴露的接口
 */
function Morpher2D(stage) {


    /**
     * 刷新整个控制器，包括重绘关节，重绘拖拽徽标
     */
    function update() {

        //添加关节
        
        //添加关节控制器
        if (_jointIndex == null || _jointIndex >= _joints.length) return;
        produceController(mesh.points[_jointIndex][0], mesh.points[_jointIndex][1]);
    }

    /**
     * 绘制关节拖拽徽标
     * @param {number} x0 关节的x坐标（绘制坐标）
     * @param {numner} y1 关节的y坐标（绘制坐标）
     */    
    function produceController(x0, y0) {
        var colors = stage.getColor();
        var xh = _svg.path([
            ["M", x0, y0 + 2],
            ["L", x0 + _renderSize + _size * _floatSize - 10, y0 + 2],
            ["L", x0 + _renderSize + _size * _floatSize - 10, y0 + 6],
            ["L", x0 + _renderSize + _size * _floatSize, y0],
            ["L", x0 + _renderSize + _size * _floatSize - 10, y0 - 6],
            ["L", x0 + _renderSize + _size * _floatSize - 10, y0 - 2],
            ["L", x0, y0 - 2],
            ["M", x0, y0 + 2]
        ]).attr({
            "fill": colors[0]
        });
        var yh = _svg.path([
            ["M", x0 + 2, y0],
            ["L", x0 + 2, y0 + _renderSize + _size * _floatSize - 10],
            ["L", x0 + 6, y0 + _renderSize + _size * _floatSize - 10],
            ["L", x0, y0 + _renderSize + _size * _floatSize],
            ["L", x0 - 6, y0 + _renderSize + _size * _floatSize - 10],
            ["L", x0 - 2, y0 + _renderSize + _size * _floatSize - 10],
            ["L", x0 - 2, y0],
            ["M", x0 + 2, y0]
        ]).attr({
            "fill": colors[1]
        });
        var circle = _svg.circle(x0, y0, 5).attr({
            "fill": _hoverColor
        });
        circle[0].tcType = yh[0].tcType = xh[0].tcType = "M2D";
        xh[0].tcItem = "x";
        yh[0].tcItem = "y";
        circle[0].tcItem = "b";
        xh[0].tcCursor = "eResize";
        yh[0].tcCursor = "sResize";
        circle[0].tcCursor = "move";
        _controller.push(xh);
        _controller.push(yh);
        _controller.push(circle);
    }

    /**
     * 拖动关节
     * @param {number} d2 x轴拖动增量
     * @param {number} d3 y轴拖动增量
     */
    function dragging(d2, d3) {
        //预处理
        if (_command == "x") {
            d2[1] = 0;
        } else if (_command == "y") {
            d2[0] = 0;
        }
        //移动控制器
        _controller[0].translate(d2[0], d2[1]);
        _controller[1].translate(d2[0], d2[1]);
        _controller[2].translate(d2[0], d2[1]);
        _joints[_jointIndex].translate(d2[0], d2[1]);
        //修改关节并重绘
        var mesh, vector;
        mesh = stage.getMesh(_meshID);
        vector = mesh.points[_jointIndex];
        vector[0] += d2[0];
        vector[1] += d2[1];
        stage.reDraw();
    }
    /**
     * 拖动关节结束
     * @param {Object} op 鼠标按下时，鼠标对应的3D世界坐标
     * @param {Object} np 鼠标抬起时，鼠标对应的3D世界坐标
     * @return {Array} 关节在3D世界坐标中的移动增量
     */
    function dragover(op, np) {
        if (_jointIndex == null || _meshID == null || !op || !np) return;
        var dx = np.x - op.x;
        var dy = np.y - op.y;
        var dz = np.z - op.z;
        var geo = stage.getMesh(_meshID).geo;
        var vector = geo.geometry.vertices[_jointIndex];
        var matrix = tcMath.rotateMatrix(geo);
        var world = tcMath.Local2Global(vector.x, vector.y, vector.z, matrix, geo);
        var local = null;
        var view = stage.getView();
        if (view == "xoz") {
            if (_command == "x") {
                dz = dy = 0;
            } else if (_command == "y") {
                dx = dy = 0;
            }
        } else if (view == "xoy") {
            if (_command == "x") {
                dy = dz = 0;
            } else if (_command == "y") {
                dx = dz = 0;
            }
        } else {
            if (_command == "x") {
                dz = dx = 0;
            } else if (_command == "y") {
                dy = dx = 0;
            }
        }
        world[0] += dx;
        world[1] += dy;
        world[2] += dz;
        local = tcMath.Global2Local(world[0], world[1], world[2], geo);
        vector.x = local[0];
        vector.y = local[1];
        vector.z = local[2];
        geo.geometry.verticesNeedUpdate = true;
        return [dx, dy, dz];
    }

    return {
        /**
         * 刷新并重绘所有关节和关节拖拽徽标
         */
        update: function() {
            update();
        },
        /**
         * 令本控制绑定物体
         * @param {number} id 物体id
         */
        attach: function(id) {
            _meshID = id;
            update();
        },
        /**
         * 令本控制器卸载物体
         */
        detach: function() {
            _meshID = null;
            _jointIndex = null;
            clear();
        },
        /**
         * 令本控制器绑定关节
         * @param {number} index 关节索引号
         */
        attachJoint: function(index) {
            _jointIndex = index;
            update();
        },
        /**
         * 令本控制器卸载关节
         */
        detachJoint: function() {
            _jointIndex = null;
            for (var n = 0; n < _controller.length; n++) {
                _controller[n].remove();
            }
            _controller = [];
        },
        /**
         * 设置本控制器关节拖动徽标的工作状态
         * @param {string} v 工作状态
         * x表示只在绘制坐标系x轴方向有效，y表示只在y轴方向有效，否则都有效
         */
        setCommand: function(v) {
            _command = v;
        },
        /**
         * 获取本控制器关节拖动徽标的工作状态
         * @return {string} 徽标工作状态
         */
        getCommand: function() {
            return _command;
        },
        /**
         * 拖动关节
         * @param {number} d2 x轴拖动增量
         * @param {number} d3 y轴拖动增量
         */
        dragging: function(d2, d3) {
            dragging(d2, d3);
        },
        /**
         * 拖动关节结束
         * @param {Object} op 鼠标按下时，鼠标对应的3D世界坐标
         * @param {Object} np 鼠标抬起时，鼠标对应的3D世界坐标
         * @return {Array} 关节在3D世界坐标中的移动增量
         */
        dragover: function(op, np) {
            return dragover(op, np);
        }
    }
}