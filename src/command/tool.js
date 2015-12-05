define(function (require) {

    function updateUILightBox(me, obj) {
        me.ui.refs.containerright.refs.verticallist.refs.lightBox.setState(obj);
    }

    function toogleLightProp(me, uuid, prop) {
        var ml = me.light;
        var light = ml.children[uuid];
        var anchor = ml.anchors[uuid];
        var uiState = {light: ml.children};
        light[prop] = !light[prop];
        anchor[prop] = !anchor[prop];
        if (prop === 'visible' && light.visible) {
            for (var key in me.stage.$3d.children) me.stage.$3d.children[key].material.needsUpdate = true;
        }
        if (ml.attached && ml.attached.uuid === uuid && (!light.visible || light.locked)) {
            ml.detach();
            uiState.selected = '';
        }
        updateUILightBox(me, uiState);
    }

    return {
        detach: function () {
            if (this.transformer.attached) {
                detachMesh(this, 'transformer', this.transformer.mesh.uuid);
            }
            if (this.morpher.state !== 0) {
                detachMesh(this, 'morpher', this.morpher.mesh.uuid);
            }
        },
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
        lightVisible: function (cmd, uuid) {
            toogleLightProp(this, uuid, 'visible');  
        },
        lightLock: function (cmd, uuid) {
            toogleLightProp(this, uuid, 'locked');  
        },
        lightDelete: function (cmd, uuid) {
            this.light.remove(uuid);
            updateUILightBox(this, {
                light: this.light.children,
                selected: this.light.attached ? this.light.attached.uuid + ';' : ''
            });
        },
        lightSelect: function (cmd, uuid) {
            var sysTool = this.ui.refs.containerleft.refs.controlbar.state.systemtool;
            var anchor = this.light.anchors[uuid];
            if (sysTool !== 'picklight' || !anchor.visible || anchor.locked) return;
            this.light.attach(anchor);
            updateUILightBox(this, {selected: uuid + ';'});
        }
    };
});
