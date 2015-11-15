define(function (Require) {

    function getUUID(cmd) {
        return cmd.split('-;')[1];
    }

    function detachMesh(me, helper, uuid) {
        if (me[helper].mesh && me[helper].mesh.uuid === uuid) {
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
            var rightContainer = me.ui.refs.containerright;
            rightContainer.refs.stageContent.refs.meshBox.setState({selected: ''});
        }
    }

    function attachMesh(me, helper, mesh) {
        if (me[helper].mesh) {
            if (me[helper].mesh.uuid === mesh.uuid) {
                return;
            }
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
        }
        me[helper].attach(mesh);
        me.stage.changeMeshColor(mesh, 'active');
        var rightContainer = me.ui.refs.containerright;
        rightContainer.refs.stageContent.refs.meshBox.setState({selected: mesh.uuid + ';'});
    }

    function toogleMeshProp(me, uuid, prop) {
        me.stage.toogleMeshProp(uuid, prop);
        detachMesh(me, 'transformer', uuid);
        detachMesh(me, 'morpher', uuid);
        me.ui.refs.containerright.refs.stageContent.refs.meshBox.setState({
            meshes: me.stage.$3d.children
        });
    }

    function toogleLightProp(me, uuid, prop) {
        var ml = me.light;
        var light = ml.children[uuid];
        var anchor = ml.anchors[uuid];
        var uiState = {light: ml.children};
        light[prop] = !light[prop];
        anchor[prop] = !anchor[prop];
        if (prop === 'visible') {
            ml.stage.scene[(light.visible ? 'add' : 'remove')](light);
        }
        if (ml.attached && ml.attached.uuid === uuid && (!light.visible || light.locked)) {
            ml.detach();
            uiState.selected = '';
        }
        me.ui.refs.containerright.refs.stageContent.refs.lightBox.setState(uiState);
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
            var mesh = this.stage.$3d.children[getUUID(cmd)];
            if (mesh.locked) {
                return;
            }
            this.stage.remove(uuid);
            detachMesh(this, 'transformer', uuid);
            detachMesh(this, 'morpher', uuid);
            this.ui.refs.containerright.refs.stageContent.refs.meshBox.setState({
                meshes: this.stage.$3d.children
            });
        },
        meshSelect: function (cmd) {
            var sysTool = this.ui.refs.containerleft.refs.controlbar.state.systemtool;
            var mesh = this.stage.$3d.children[getUUID(cmd)];
            if (!mesh || !mesh.visible || mesh.locked) {
                return;
            }
            if (sysTool === 'pickgeo') {
                attachMesh(this, 'transformer', mesh);
                return;
            }
            if (sysTool === 'pickjoint') {
                attachMesh(this, 'morpher', mesh);
                return;
            }
        },
        lightVisible: function (cmd) {
            toogleLightProp(this, getUUID(cmd), 'visible');  
        },
        lightLock: function (cmd) {
            toogleLightProp(this, getUUID(cmd), 'locked');  
        },
        lightDelete: function (cmd) {
            this.light.remove(getUUID(cmd));
            this.ui.refs.containerright.refs.stageContent.refs.lightBox.setState({
                light: this.light.children,
                selected: this.light.attached ? this.light.attached.uuid + ';' : ''
            });
        },
        lightSelect: function (cmd) {
            var sysTool = this.ui.refs.containerleft.refs.controlbar.state.systemtool;
            var uuid = getUUID(cmd);
            var anchor = this.light.anchors[uuid];
            if (sysTool !== 'picklight' || !anchor.visible || anchor.locked) return;
            this.light.attach(anchor);
            this.ui.refs.containerright.refs.stageContent.refs.lightBox.setState({
                selected: uuid + ';'
            });
        }
    };
});
