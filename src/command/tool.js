/**
 * click命令解析单元
 */
define(function (Require) {
    return {
        camerazoomin: function () {
            this.stage.callFunction('zoomCamara', true);
        },
        camerazoomout: function () {
            this.stage.callFunction('zoomCamara', false);
        },
        gridenlarge: function () {
            this.stage.callFunction('resizeGrid', true);
        },
        gridnarrow: function () {
            this.stage.callFunction('resizeGrid', false);
        },
        gridtoggle: function () {
            this.stage.callFunction('toggleHelper');
        }
    };
});