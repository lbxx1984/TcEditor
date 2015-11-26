define(function (Require) {

    function detachMesh(me, helper, uuid) {
        if (me[helper].mesh && me[helper].mesh.uuid === uuid) {
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
            var rightContainer = me.ui.refs.containerright;
            var leftContainer = me.ui.refs.containerleft;
            rightContainer.refs.verticallist.refs.meshBox.setState({selected: ''});
            leftContainer.refs.stage.setState({activeMesh: null});
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
        var leftContainer = me.ui.refs.containerleft;
        rightContainer.refs.verticallist.refs.meshBox.setState({selected: mesh.uuid + ';'});
        leftContainer.refs.stage.setState({activeMesh: mesh});
    }

    function toogleMeshProp(me, uuid, prop) {
        me.stage.toogleMeshProp(uuid, prop);
        detachMesh(me, 'transformer', uuid);
        detachMesh(me, 'morpher', uuid);
        me.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
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
        me.ui.refs.containerright.refs.verticallist.refs.lightBox.setState(uiState);
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
        meshVisible: function (cmd, uuid) {
            toogleMeshProp(this, uuid, 'visible');
        },
        meshLock: function (cmd, uuid) {
            toogleMeshProp(this, uuid, 'locked');
        },
        meshDelete: function (cmd, uuid) {
            var mesh = this.stage.$3d.children[uuid];
            if (mesh.locked) {
                return;
            }
            this.stage.remove(uuid);
            detachMesh(this, 'transformer', uuid);
            detachMesh(this, 'morpher', uuid);
            this.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
                meshes: this.stage.$3d.children
            });
        },
        meshSelect: function (cmd, uuid) {
            var sysTool = this.ui.refs.containerleft.refs.controlbar.state.systemtool;
            var mesh = this.stage.$3d.children[uuid];
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
        lightVisible: function (cmd, uuid) {
            toogleLightProp(this, uuid, 'visible');  
        },
        lightLock: function (cmd, uuid) {
            toogleLightProp(this, uuid, 'locked');  
        },
        lightDelete: function (cmd, uuid) {
            this.light.remove(uuid);
            this.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({
                light: this.light.children,
                selected: this.light.attached ? this.light.attached.uuid + ';' : ''
            });
        },
        lightSelect: function (cmd, uuid) {
            var sysTool = this.ui.refs.containerleft.refs.controlbar.state.systemtool;
            var anchor = this.light.anchors[uuid];
            if (sysTool !== 'picklight' || !anchor.visible || anchor.locked) return;
            this.light.attach(anchor);
            this.ui.refs.containerright.refs.verticallist.refs.lightBox.setState({
                selected: uuid + ';'
            });
        },
        detach: function () {
            if (this.transformer.attached) {
                detachMesh(this, 'transformer', this.transformer.mesh.uuid);
            }
            if (this.morpher.state !== 0) {
                detachMesh(this, 'morpher', this.morpher.mesh.uuid);
            }
        }
    };
});
