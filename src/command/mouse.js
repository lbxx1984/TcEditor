/**
 * click命令解析单元
 */
define(function (Require) {
    var _down = false;
    var _mouse = [-1, -1];

    /**通用鼠标事件**/
    function mousedown(e) {
        _down = true;
        _mouse[0] = e.clientX;
        _mouse[1] = e.clientY;
    }
    function mouseup(e) {
        _down = false;
    }

    return {
        cameramove: {
            mousemove: function (e) {
                if (!_down) {
                    return;
                }
                this.stage.cameraMove(e.clientX - _mouse[0], e.clientY - _mouse[1]);
                _mouse[0] = e.clientX;
                _mouse[1] = e.clientY;
            },
            mousedown: mousedown,
            mouseup: mouseup
        }
    };
});