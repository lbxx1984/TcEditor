define(function (require) {

    var common = require('./common');

    function mousedown(e) {
        common._down = true;
        common._mouse = [e.clientX, e.clientY];
    }

    function mouseup(e) {
        common._down = false;
    }

    return {
        mousemove: function (e) {
            if (!common._down) return;
            this.stage.cameraMove(e.clientX - common._mouse[0], e.clientY - common._mouse[1]);
            common._mouse = [e.clientX, e.clientY];    
        },
        loaded: function () {
            common.updateControlBar(this, 'systemtool', 'cameramove');
        },
        mousedown: mousedown,
        mouseup: mouseup,
        mouseleave: mouseup
    };

});
