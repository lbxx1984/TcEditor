define(function (Require) {


    function updateMesh(me, mesh) {
        var leftcontainer = me.ui.refs.containerleft;
        var view = leftcontainer.refs.controlbar.state.cameraview;
        leftcontainer.refs.stage.setState({activeMesh: mesh});
        if (view === '3d') {
            me.transformer.$3d.update();
        }
        else {
            me.stage.$2d.children[mesh.uuid].reset();
            me.stage.$2d.renderMesh();
            me.transformer.$2d.update();
        }
    }


    return {
        position: function (cmd, direction, value) {
            var mesh = this.transformer.mesh;
            if (!mesh) return;
            mesh.position[direction] = ~~value;
            updateMesh(this, mesh);
        },
        rotation: function (cmd, direction, value) {
            var mesh = this.transformer.mesh;
            if (!mesh) return;
            mesh.rotation[direction] = (~~value) * Math.PI / 180;
            updateMesh(this, mesh);
        },
        scale: function (cmd, direction, value) {
            var mesh = this.transformer.mesh;
            value = parseFloat(value);
            if (!mesh || value === 0.0 || value < 0 || isNaN(value)) return;
            mesh.scale[direction] = value;
            updateMesh(this, mesh);
        },
        name: function (cmd, mesh, name) {
            mesh.name = name;
            this.ui.refs.containerright.refs.verticallist.refs.meshBox.setState({
                meshes: this.stage.$3d.children
            });
            this.ui.refs.containerleft.refs.stage.setState({
                activeMesh: mesh
            });
        },
        color: function (cmd, mesh, color) {
            mesh[window.editorKey].color = color;
            mesh.material.setValues({color: color});
        }
    };
});
