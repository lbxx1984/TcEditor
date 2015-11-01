define(function (Require) {

    function getUUID(cmd) {
        return cmd.split('-;')[1];
    }

    function detachMesh(me, helper, uuid) {
        if (me[helper].mesh && me[helper].mesh.uuid === uuid) {
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
        }
    }

    function toogleMeshProp(me, uuid, prop) {
        me.stage.toogleMeshProp(uuid, prop);
        detachMesh(me, 'transformer', uuid);
        detachMesh(me, 'morpher', uuid);
        me.ui.refs.containerright.refs.stageContent.refs.meshBox.setState(me.stage.$3d.children);
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
            toogleMeshProp(this, getUUID(cmd), 'visible');
        },
        meshLock: function (cmd) {
            toogleMeshProp(this, getUUID(cmd), 'locked');
        },
        meshDelete: function (cmd) {
            var uuid = getUUID(cmd);
            this.stage.remove(uuid);
            detachMesh(this, 'transformer', uuid);
            detachMesh(this, 'morpher', uuid);
            delete this.ui.refs.containerright.refs.stageContent.refs.meshBox.state[uuid];
            this.ui.refs.containerright.refs.stageContent.refs.meshBox.setState(this.stage.$3d.children);
        },
        meshSelect: function (cmd) {
            console.log(cmd);
        }
    };
});
