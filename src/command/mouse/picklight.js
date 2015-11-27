define(function (require) {

    var common = require('./common');

    return {
        loaded: function () {
            common._down = false;
            this.light.show();
            common.updateControlBar(this, 'systemtool', 'picklight');
        },
        unload: function () {
            this.light.hide();
            this.light.detach();
            this.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({selected: ''});
        },
        mouseRightClick: function (e) {
            common._down = false;
            this.light.detach();
            this.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({selected: ''});
        },
        mousemove: function (e) {
            if (!common._down) {
                var mesh = this.stage.getMeshByMouse(e, this.light.anchorsArray);
                if (mesh) {
                    this.light.hover(mesh.uuid);
                }
                else {
                    this.light.hover('');   
                }
                return;
            }
        },
        mouseup: function (e) {
            common._down = false;
            var mesh = this.stage.getMeshByMouse(e, this.light.anchorsArray);
            if (!mesh) return;
            this.light.attach(mesh);
            this.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({selected: mesh.uuid + ';'});
        }
    };
});
