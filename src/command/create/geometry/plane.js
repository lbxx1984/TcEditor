define(function (require) {
    return {
        tempMesh: function (param) {
            var step = 5;
            var width = Math.abs(param.mouseUp.x - param.mouseDown.x);
            var height = Math.abs(param.mouseUp.z - param.mouseDown.z);
            var mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height, step, step),
                param.material
            );
            mesh.rotation.x = Math.PI / 2;
            return mesh;
        }
    };
});