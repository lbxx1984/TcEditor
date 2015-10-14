/**
 * 骨骼控制器 3D子组成
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * 构造函数
 * @constructor
 * @param {Object} camera 3D编辑器中的摄像机对象
 * @param {Object} scene 3D编辑器中的场景对象
 * @return {Object} 本控制器对外暴露的接口
 */
function Morpher3D(camera, scene) {


    /**
     * 根据摄像机位置，重新设置关节徽标的大小
     */
    function resizeJoint() {
        var newPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        var jointPos = null;
        if (_oldpos.equals(newPos)) return;
        _oldpos = newPos;
        for (var n = 0; n < _joints.length; n++) {
            if (_joints[n].added == false) break;
            jointPos = new THREE.Vector3(
                        _joints[n].position.x,
                        _joints[n].position.y,
                        _joints[n].position.z
                    );
            var s = _oldpos.distanceTo(jointPos) / _baseRule;
            _joints[n].scale.x = _joints[n].scale.y = _joints[n].scale.z = s; 
        }
    }

    /**
     * 根据关节徽标的新位置，同步物体内部关节的信息
     * @param {Object} joint 关节徽标
     */
    function moving(joint) {
        var pos = tcMath.Global2Local(joint.position.x, joint.position.y, joint.position.z, _geo);
        _geo.geometry.vertices[joint.index].x = pos[0];
        _geo.geometry.vertices[joint.index].y = pos[1];
        _geo.geometry.vertices[joint.index].z = pos[2];
        _geo.geometry.verticesNeedUpdate = true;
        var v = _oldpos.distanceTo(
                    new THREE.Vector3(joint.position.x, joint.position.y, joint.position.z)
                ) / _baseRule;
        joint.scale.x = joint.scale.y = joint.scale.z = v;
    }
    


    /**
     * 令本控制器解绑物体
     */
    function detach() {
        release();
        _geo = null;
    }
    
    /**
     * 将所有关节徽标从3D场景中移除
     */
    function release() {
        for (var n = 0; n < _joints.length; n++) {
            if (_joints[n].added == false) break;
            scene.remove(_joints[n]);
            _joints[n].added = false;
        }
    }
    
    /**
     * 重新添加所有关节
     */
    function reloadJoint() {
        if (_geo == null) return;
        var matrix, vertices, pos, camerapos, meshpos;
        matrix = tcMath.rotateMatrix(_geo);
        vertices = _geo.geometry.vertices;
        camerapos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        for (var n = 0; n < vertices.length; n++) {
            pos = tcMath.Local2Global(vertices[n].x, vertices[n].y, vertices[n].z, matrix, _geo);
            meshpos = new THREE.Vector3(pos[0], pos[1], pos[2]);
            _joints[n].position.x = pos[0];
            _joints[n].position.y = pos[1];
            _joints[n].position.z = pos[2];
            var s = meshpos.distanceTo(camerapos) / _baseRule;
            _joints[n].scale.x = _joints[n].scale.y = _joints[n].scale.z = s;   
        }
        resizeJoint();
    }

    return {
        /**
         * 根据摄像机位置，重新设置关节徽标的大小
         */
        resizeJoint: function() {
            resizeJoint();
        },
        /**
         * 重新添加所有关节
         */
        reloadJoint: function() {
            reloadJoint();
        },
        /**
         * 令本控制器解绑物体
         */
        detach: function() {
            detach();
        },
        /**
         * 根据关节徽标的新位置，同步物体内部关节的信息
         * @param {Object} joint 关节徽标
         */
        moving: function(joint) {
            moving(joint);
        },
        /**
         * 设置关节徽标的大小
         * @param {numner} 关节大小
         */
        setSize: function(value) {
            _baseRule = value;
        },
        /**
         * 本控制器的所有关节徽标
         * @return {Array} 关节徽标集合
         */
        getJoints: function() {
            return _joints;
        }
    }
}