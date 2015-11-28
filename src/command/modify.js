define(function (require) {

    var math = require('math');

    function updateMesh(me, mesh) {
        var leftcontainer = me.ui.refs.containerleft;
        var view = leftcontainer.refs.controlbar.state.cameraview;
        leftcontainer.refs.stage.setState({activeMesh: mesh});
        if (view !== '3d') {
            me.stage.$2d.children[mesh.uuid].reset();
            me.stage.$2d.renderMesh();
        }
        if (me.transformer.attached) {
            me.transformer.attach(mesh);
        }
        if (me.morpher.state === 1) {
            me.morpher.detach();
            me.morpher.attach(mesh);
        }
        else if (me.morpher.state === 2) {
            var joint = me.morpher.joint;
            me.morpher.detach();
            me.morpher.attach(mesh);
            me.morpher.attachJoint(joint);
        }
    }


    return {
        position: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
            if (!mesh) return;
            mesh.position[direction] = ~~value;
            updateMesh(this, mesh);
        },
        rotation: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
            if (!mesh) return;
            value = (~~value) % 360;
            mesh.rotation[direction] = value * Math.PI / 180;
            updateMesh(this, mesh);
        },
        scale: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
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
            updateMesh(this, mesh);
        },
        wireframe: function (cmd, mesh, v) {
            mesh.material.wireframe = v;
            mesh.material.setValues({emissive: (v ? mesh[window.editorKey].color : 0)});
            this.ui.refs.containerleft.refs.stage.setState({
                activeMesh: mesh
            });
        },
        vector: function (cmd, mesh, joint, direction, value) {
            var vector = mesh.geometry.vertices[joint];
            var matrix = math.rotateMatrix(mesh);
            var world = math.Local2Global(vector.x, vector.y, vector.z, matrix, mesh);
            world[direction] = value;
            var local = math.Global2Local(world[0], world[1], world[2], mesh);
            vector.x = local[0];
            vector.y = local[1];
            vector.z = local[2];
            mesh.geometry.verticesNeedUpdate = true;
            updateMesh(this, mesh);
        }
    };
});
