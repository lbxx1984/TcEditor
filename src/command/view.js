define(function (require) {

    function updateControlBar(me, view) {
        var controlBar = me.ui.refs.containerleft.refs.controlbar;
        if (controlBar.state.cameraview === view) return;
        controlBar.setState({cameraview: view});
    }

    return {
        '3d': function () {
            this.stage.changeView('3d');
            this.transformer.update('$3d');
            this.morpher.update('$3d');
            updateControlBar(this, '3d');
        },
        xoz: function () {
            this.stage.changeView('xoz');
            this.transformer.update('$2d');
            this.morpher.update('$2d');
            updateControlBar(this, 'xoz');
        },
        zoy: function () {
            this.stage.changeView('zoy');
            this.transformer.update('$2d');
            this.morpher.update('$2d');
            updateControlBar(this, 'zoy');
        },
        xoy: function () {
            this.stage.changeView('xoy');
            this.transformer.update('$2d');
            this.morpher.update('$2d');
            updateControlBar(this, 'xoy');
        }
    };
});