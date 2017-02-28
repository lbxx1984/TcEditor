/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var _dragging_temp_data_ = '';


    return {
        // 平移摄像机
        'camera-move-2d': function (param, dragging) {
            if (param === 'mouseup' && window._dragging_temp_data_) {
                // console.log(window._dragging_temp_data_);
                // var stage = _.extend({}, this.get('stage'));
                // stage.camera3D = _.extend({}, stage.camera3D, {lookAt: _dragging_temp_data_});
                // this.set('stage', stage);
                // _dragging_temp_data_ = null;
                return;
            }
            if (!dragging) return;
            var canvas = param.stage2D.refs.grid;
            canvas.style.left = canvas.offsetLeft + param.mouseDelta2D.x + 'px';
            canvas.style.top = canvas.offsetTop + param.mouseDelta2D.y + 'px';
            if (!_dragging_temp_data_) {
                _dragging_temp_data_ = JSON.stringify(param.stage2D.props.cameraLookAt);
            }
            console.log('before:' + _dragging_temp_data_);
            var lookAt = JSON.parse(_dragging_temp_data_);
            lookAt.x = lookAt.x - param.mouseDelta3D.x;
            lookAt.y = lookAt.y - param.mouseDelta3D.y;
            lookAt.z = lookAt.z - param.mouseDelta3D.z;
            _dragging_temp_data_ = JSON.stringify(lookAt);
            console.log('after:' + _dragging_temp_data_);
            // if (window._dragging_temp_data_) {
            //     console.log('?');
            //     window._dragging_temp_data_ = JSON.parse();
            // }
            // // console.log(window._dragging_temp_data_);
            // window._dragging_temp_data_.x = window._dragging_temp_data_.x;
            // window._dragging_temp_data_.y = window._dragging_temp_data_.y - param.mouseDelta3D.y;
            // window._dragging_temp_data_.z = window._dragging_temp_data_.z - param.mouseDelta3D.z;
            // console.log(window._dragging_temp_data_);
        },
        'camera-move': function (param, dragging) {
            if (this.get('tool') !== 'camera-move') {
                var selectedMesh = this.get('selectedMesh');
                if (selectedMesh) {
                    selectedMesh.material.setValues({color: selectedMesh.tc.materialColor});
                }
                this.fill({
                    tool: 'camera-move',
                    selectedMesh: null
                });
                return;
            }
            if (!dragging) return;
            var stage = param.stage3D;
            var angleB = stage.props.cameraAngleB;
            var speed = stage.props.cameraMoveSpeed;
            var cameraPos = stage.camera.position;
            var dx = stage.props.cameraRadius * param.mouseDelta2D.x * speed * 0.2 / stage.refs.container.offsetWidth;
            var dy = stage.props.cameraRadius * param.mouseDelta2D.y * speed * 0.2 / stage.refs.container.offsetHeight;
            var lookAt = stage.props.cameraLookAt;
            lookAt = {x: lookAt.x, y: lookAt.y, z: lookAt.z};
            if (Math.abs(stage.props.cameraAngleA) > 2) {
                lookAt.x -= Math.sin(Math.PI * angleB / 180) * dx;
                lookAt.z += Math.cos(Math.PI * angleB / 180) * dx;
                lookAt.x -= Math.cos(Math.PI * angleB / 180) * dy * Math.abs(cameraPos.y) / cameraPos.y;
                lookAt.z -= Math.sin(Math.PI * angleB / 180) * dy * Math.abs(cameraPos.y) / cameraPos.y;
            }
            else {
                lookAt.x -= Math.sin(Math.PI * angleB / 180) * dx;
                lookAt.z += Math.cos(Math.PI * angleB / 180) * dx;
                lookAt.y += dy;
            }
            stage = _.extend({}, this.get('stage'));
            stage.camera3D = _.extend({}, stage.camera3D, {lookAt: lookAt});
            this.set('stage', stage);
        },
        // 推进摄像机
        'camera-zoomIn': function () {
            var stage = _.extend({}, this.get('stage'));
            var radius = stage.camera3D.cameraRadius;
            radius = radius - 0.2 * radius * 240 / document.body.offsetWidth;
            radius = Math.max(radius, 50);
            radius = Math.min(radius, 5000);
            stage.camera3D = _.extend({}, stage.camera3D, {cameraRadius: radius});
            this.set('stage', stage);
        },
        // 推远摄像机
        'camera-zoomOut': function () {
            var stage = _.extend({}, this.get('stage'));
            var radius = stage.camera3D.cameraRadius;
            radius = radius + 0.2 * radius * 240 / document.body.offsetWidth;
            radius = Math.max(radius, 50);
            radius = Math.min(radius, 5000);
            stage.camera3D = _.extend({}, stage.camera3D, {cameraRadius: radius});
            this.set('stage', stage);
        },
        // 重置摄像机
        'camera-reset': function () {
            this.fill({
                stage: {
                    colorStage: ['#3D3D3D', 0x3d3d3d],
                    colorGrid: ['#8F908A', 0x8F908A],
                    camera3D: {
                        cameraRadius: 1000,
                        cameraAngleA: 40,
                        cameraAngleB: 45,
                        lookAt: {x: 0, y: 0, z: 0}
                    },
                    gridVisible: true,
                    gridSize3D: 2500,
                    gridStep3D: 50
                },
                mouse3d: {x: 0, y: 0, z: 0}
            });
        }
    };


});
