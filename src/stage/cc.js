/**
 * 摄像机控制器
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function($) {
    
/**
 * 控制器插件
 * @param {Object} 配置参数
 * @param {number} param.cameraAngleA 摄像机观察线与XOZ平面夹角
 * @param {numner} param.cameraAngleB 摄像机观察线XOZ平面投影，与X轴夹角
 * @param {boolean} param.animate 控制器在切换角度时是否使用动画效果
 * @param {number} param.width 控制器整体宽度
 * @param {numner} param.height 控制器整体高度
 * @param {string} param.language 编辑器的语言种类，涉及到纹理路径
 */
$.fn.CameraController = function(param) {
    
    

    

    /**注册事件*/
    _this
        .bind('mouseleave', function () {
            if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
            _INTERSECTED = null;
        })
        .bind('mousedown', function (e) {
            _tmpMouse[0] = e.clientX;
            _tmpMouse[1] = e.clientY;
            $(window)
                .bind('mousemove', freeRotateCamera)
                .bind('mouseup', unbindMouseMove)
        })
        .bind('mousemove', function (e) {
            var pos = _this.position();
            var vector = new THREE.Vector3(
                ((e.clientX - pos.left) / param.width) * 2 - 1, 
                -((e.clientY - pos.top) / param.height) * 2 + 1,
                1
            );
            vector.unproject(_camera);
            _raycaster.ray.set(_camera.position, vector.sub(_camera.position).normalize());
            var intersects = _raycaster.intersectObjects(_scene.children);
            if (intersects.length > 0) {
                if (_INTERSECTED != intersects[0].object) {
                    if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
                    _INTERSECTED = intersects[0].object;
                    _INTERSECTED.material.opacity = 0.2
                }
            } else {
                if (_INTERSECTED) _INTERSECTED.material.opacity = 1;
                _INTERSECTED = null;
            }

        })
        .bind('mouseup', function () {
            $(window).unbind('mousemove', freeRotateCamera);
            if (_cameraRotated) {
                _cameraRotated = false;
                return;
            }
            if (!_INTERSECTED) return;
            var c = cmd[_INTERSECTED.tid];
            if (c[0] != null) cameraAngleTo(c[0], 'A');
            if (c[1] != null) cameraAngleTo(c[1], 'B');
        });
    _this[0].onmousewheel = function () {
        return false;
    }




    /**以下是内部方法*/
    /**
     * 设置摄像机的角度A
     * @param {number} dx 角度A要变动到的值
     */
    function toA(dx) {
        if (dx == 0) return;
        var dy = _cameraMoveSpeed * dx * 90 / Math.PI / $(window).height();
        if (_cameraAngleA < 90 && _cameraAngleA + dy > 90) dy = 0;
        if (_cameraAngleA > -90 && _cameraAngleA + dy < -90) dy = 0;
        _cameraAngleA = _cameraAngleA + dy;
    }
    /**
     * 设置摄像机的角度B
     * @param {number} dx 角度B要变动到的值
     */
    function toB(dx) {
        if (dx == 0) return;
        _cameraAngleB += _cameraMoveSpeed * dx * 90 / Math.PI / $(window).width();
        if (_cameraAngleB > 360) _cameraAngleB -= 360;
        if (_cameraAngleB < 0)  _cameraAngleB += 360;
    }
    /**
     * 通过拖动自由旋转控制模仿
     * @param {Object} e 鼠标事件对象
     */
    function freeRotateCamera(e) {
        var dx = e.clientY - _tmpMouse[1];
        var dy = e.clientX - _tmpMouse[0];
        if (dx == 0 && dy == 0) return;
        toA(e.clientY - _tmpMouse[1]);
        toB(e.clientX - _tmpMouse[0]);
        _tmpMouse = [e.clientX, e.clientY];
        _cameraRotated = true;
        setCameraPosition();
        updateStage();
    }
    /**
     * 鼠标抬起后解绑鼠标移动事件句柄
     */
    function unbindMouseMove() {
        _cameraRotated = false;
        $(window).unbind('mousemove', freeRotateCamera);
    }

    /**
     * 更新绑定到控制器的所有舞台中的摄像机
     */
    function updateStage() {
        if (_stage.length == 0) return;
        for (var n = 0; n < _stage.length; n++) {
            _stage[n].setCamera({
                a: _cameraAngleA,
                b: _cameraAngleB
            });
        }
    }
    /**
     * 更改摄像机的控制参数，可以一次性，也可以动画
     * @param {number} to 要设置的值
     * @oaram {string} type 具体参数，A或B，对应角度参数A和B
     */
    function cameraAngleTo(to, type) {
        if (!_animate) {
            if (type == 'A') {
                _cameraAngleA = to;
            } else {
                _cameraAngleB = to;
            }
            setCameraPosition();
            updateStage();
            return;
        }
        if (type == 'A') {
            var old = _cameraAngleA;
            var step = Math.abs(old - to) / 10;
            if (step < 1) {
                _cameraAngleA = to;
                setCameraPosition();
                updateStage();
                return;
            }
            if (old > to) {
                _cameraAngleA -= step;
            } else {
                _cameraAngleA += step;
            }
            setCameraPosition();
            updateStage();
            setTimeout(function () {
                cameraAngleTo(to, type)
            }, 2);
        }
        if (type == 'B') {
            var old = _cameraAngleB;
            var step = Math.abs(old - to) / 10;
            if (step < 1) {
                _cameraAngleB = to;
                setCameraPosition();
                updateStage();
                return;
            }
            if (old > to) {
                _cameraAngleB -= step;
            } else {
                _cameraAngleB += step;
            }
            setCameraPosition();
            updateStage();
            setTimeout(function () {
                cameraAngleTo(to, type);
            }, 2);
        }
    }
    
    
    /**以下是外部接口*/

    /**
     * 添加控制的3D舞台
     * @param {Object} stage stage3D舞台对象
     */
    _this.addStage = function(stage) {
        _stage.push(stage);
    }
    /**
     * 输出控制器变更标志
     * @return {boolean} 控制器是否发生了变化
     */
    _this.cameraRotated = function () {
        return _cameraRotated;
    }
    /**
     * 设置本控制器的角度参数
     * @param {Object} obj控制参数对象
     * @param {number} obj.a 控制角度A
     * @param {number} obj.b 控制角度B
     */
    _this.cameraAngleTo = function(obj) {
        if (obj.a != null) cameraAngleTo(obj.a, 'A');
        if (obj.b != null) cameraAngleTo(obj.b, 'B');
    }
    return _this;
}
})(jQuery);
