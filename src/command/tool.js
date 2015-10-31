define(function (Require) {

    function getUUID(cmd) {
        return cmd.split('-;')[1];
    }

    return {
        camerazoomin: function () {
            this.stage.callFunction('zoomCamera', true);
        },
        camerazoomout: function () {
            this.stage.callFunction('zoomCamera', false);
        },
        gridenlarge: function () {
            this.stage.callFunction('resizeGrid', true);
        },
        gridnarrow: function () {
            this.stage.callFunction('resizeGrid', false);
        },
        gridtoggle: function () {
            this.stage.callFunction('toggleHelper');
        },
        meshVisible: function (cmd) {
            this.stage.toogleMeshProp(getUUID(cmd), 'visible');
            this.ui.refs.containerright.refs.stageContent.refs.meshBox.setState(this.stage.$3d.children);
        },
        meshLock: function (cmd) {
            this.stage.toogleMeshProp(getUUID(cmd), 'locked');
            this.ui.refs.containerright.refs.stageContent.refs.meshBox.setState(this.stage.$3d.children);
        },
        meshDelete: function (cmd) {
            var uuid = getUUID(cmd);
            this.stage.remove(uuid);
            // ReactJS判断不出来哪些state删除了，所以只能这样删
            delete this.ui.refs.containerright.refs.stageContent.refs.meshBox.state[uuid];
            this.ui.refs.containerright.refs.stageContent.refs.meshBox.setState(this.stage.$3d.children);
        },
        meshSelect: function (cmd) {
            console.log(cmd);
        }
    };
});