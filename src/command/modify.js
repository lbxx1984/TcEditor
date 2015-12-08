define(function (require) {

    var math = require('math');

    function updateContainerRight(me, data) {
        me.ui.refs.containerright.refs.verticallist.refs.meshBox.setState(data);
    }

    function updateContainerLeft(me, mesh) {
        me.ui.refs.containerleft.refs.stage.setState({activeMesh: mesh});
    }

    function updateMesh(me, mesh) {
        var view = me.ui.refs.containerleft.refs.controlbar.state.cameraview;
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
        updateContainerLeft(me, mesh);
    }

    function toogleMeshProp(me, uuid, prop) {
        me.stage.toogleMeshProp(uuid, prop);
        detachMesh(me, 'transformer', uuid);
        detachMesh(me, 'morpher', uuid);
    }

    function setMeshProp(me, meshes, prop, value) {
        for (var i = 0; i < meshes.length; i++) {
            var uuid = meshes[i].uuid;
            me.stage.setMeshProp(uuid, prop, value);
            detachMesh(me, 'transformer', uuid);
            detachMesh(me, 'morpher', uuid);
        }
    }

    function detachMesh(me, helper, uuid) {
        if (me[helper].mesh && me[helper].mesh.uuid === uuid) {
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
            updateContainerRight(me, {selected: ''});
            updateContainerLeft(me, null);
        }
    }

    function attachMesh(me, helper, mesh) {
        if (me[helper].mesh) {
            if (me[helper].mesh.uuid === mesh.uuid) return;
            me.stage.changeMeshColor(null, 'active');
            me[helper].detach();
        }
        me[helper].attach(mesh);
        me.stage.changeMeshColor(mesh, 'active');
        updateContainerRight(me, {selected: mesh.uuid + ';'});
        updateContainerLeft(me, mesh);
    }

    return {
        // 修改物体位置
        position: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
            if (!mesh) return;
            mesh.position[direction] = ~~value;
            updateMesh(this, mesh);
        },
        // 修改物体旋转
        rotation: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
            if (!mesh) return;
            value = (~~value) % 360;
            mesh.rotation[direction] = value * Math.PI / 180;
            updateMesh(this, mesh);
        },
        // 修改物体缩放
        scale: function (cmd, direction, value) {
            var mesh = this.transformer.mesh || this.morpher.mesh;
            value = parseFloat(value);
            if (!mesh || value === 0.0 || value < 0 || isNaN(value)) return;
            mesh.scale[direction] = value;
            updateMesh(this, mesh);
        },
        // 修改物体名称
        name: function (cmd, mesh, name) {
            mesh.name = name;
            updateContainerRight(this, {meshes: this.stage.$3d.children});
            updateContainerLeft(this, mesh);
        },
        // 修改物体纹理
        texture: function (cmd, mesh, fileDom) {
            var me = this;
            var url = fileDom.value;
            var file = fileDom.files[0];
            if (file.type.indexOf('image/') !== 0) return;
            var cache = me.imgCache[url];
            if (cache) {
                gotImg(cache);
            }
            else {
                var reader = new FileReader();
                reader.readAsDataURL(file); 
                reader.onload=function () {
                    var img = document.createElement('img');
                    img.src = this.result;
                    img.onload = function () {
                        me.imgCache[url] = img;
                        img.url = url;
                        gotImg(img);
                    }
                }
            }
            function gotImg(imgDom) {
                if (mesh.material.map) {
                    mesh.material.map.image = imgDom;
                }
                else {
                    mesh.material.map = new THREE.Texture(imgDom);
                }
                mesh.material.map.needsUpdate = true;
                mesh.material.needsUpdate = true;
            }
        },
        // 修改物体颜色
        color: function (cmd, mesh, color) {
            mesh[window.editorKey].color = color;
            mesh.material.setValues({color: color});
            updateMesh(this, mesh);
        },
        // 修改物体阴影
        emissive: function (cmd, mesh, color) {
            mesh[window.editorKey].emissive = color;
            mesh.material.setValues({
                color: mesh[window.editorKey].color,
                emissive: color
            });
            updateMesh(this, mesh);
        },
        // 修改物体透明度，好像没什么用
        opacity: function (cmd, mesh, opacity) {
            if (isNaN(opacity)) return;
            mesh.material.setValues({
                opacity: parseFloat(opacity),
                color: mesh[window.editorKey].color,
                transparent: opacity < 1
            });
            updateMesh(this, mesh);
        },
        // 修改物体材质框架
        wireframe: function (cmd, mesh, v) {
            mesh.material.wireframe = v;
            mesh.material.setValues({
                emissive: v ? mesh[window.editorKey].color : mesh[window.editorKey].emissive
            });
            updateContainerLeft(this, mesh);
        },
        // 修改物体渲染面
        side: function (cmd, mesh, v) {
            mesh.material.setValues({side: ~~v});
            updateMesh(this, mesh);
        },
        // 修改物体某个关节
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
        },
        // 修改物体分组
        group: function (cmd, mesh, group) {
            mesh = this.stage.$3d.children[mesh];
            if (!mesh) return;
            mesh.group = group;
            updateContainerRight(this, {meshes: this.stage.$3d.children});
        },
        // 修改物体可见性，批量
        visible: function (cmd, meshes, value) {
            if (undefined === value && meshes.length === 1) {
                toogleMeshProp(this, meshes[0], 'visible');
            }
            else {
                setMeshProp(this, meshes, 'visible', value);
            }
            updateContainerRight(this, {meshes: this.stage.$3d.children});
        },
        // 修改物体锁定状态，批量
        lock: function (cmd, meshes, value) {
            if (undefined === value && meshes.length === 1) {
                toogleMeshProp(this, meshes[0], 'locked');
            }
            else {
                setMeshProp(this, meshes, 'locked', value);
            }
            updateContainerRight(this, {meshes: this.stage.$3d.children});
        },
        // 删除物体
        delete: function (cmd, uuid) {
            uuid = uuid[0];
            detachMesh(this, 'transformer', uuid);
            detachMesh(this, 'morpher', uuid);
            var mesh = this.stage.$3d.children[uuid];
            this.stage.remove(uuid);
            updateContainerRight(this, {meshes: this.stage.$3d.children});
        },
        // 选择物体
        select: function (cmd, uuid) {
            var helpers = {pickgeo: 'transformer', pickjoint: 'morpher'};
            var helper = helpers[this.ui.refs.containerleft.refs.controlbar.state.systemtool];
            var mesh = this.stage.$3d.children[uuid];
            if (!mesh || !mesh.visible || mesh.locked || !helper) return;
            attachMesh(this, helper, mesh);
        }
    };
});
