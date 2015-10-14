define(['math'], function (math) {


    /**
     * @constructor
     */
    function Morpher3D(param) {
        this.stage = param.stage;
        this.helperColor = param.helperColor || 0xd97915;
        this.helperHoverColor = param.helperHoverColor || 0xff0000;
        this.baseRule = 1500;
        this.jointer = new THREE.Mesh(
            new THREE.SphereGeometry(10, 4, 4),
            new THREE.MeshBasicMaterial({color: this.helperColor, side: THREE.DoubleSide})
        );
        this.joints = [];
    }


    /**
     * 控制器绑定物体
     *
     * @param {Object} mesh 3D物体
     */
    Morpher3D.prototype.attach = function (mesh) {
        if (!mesh) {
            return;
        }
        // release();
        var camerapos = this.stage.camera.position;
        var matrix = math.rotateMatrix(mesh);
        var vertices = mesh.geometry.vertices;

        for (var n = 0; n < vertices.length; n++) {
            var pos = math.Local2Global(vertices[n].x, vertices[n].y, vertices[n].z, matrix, mesh);
            var meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            var np = null;
            if (n == this.joints.length) {
                np = this.jointer.clone();
                this.joints.push(np);
            }
            else {
                np = this.joints[n];
            }
            np.index = n;
            np.position.x = pos[0];
            np.position.y = pos[1];
            np.position.z = pos[2];
            np.scale.x = np.scale.y = np.scale.z = meshpos.distanceTo(camerapos) / this.baseRule;
            np.added = true;
            this.stage.scene.add(np);
        }
        // _geo = geo;
    };

    return Morpher3D;
});