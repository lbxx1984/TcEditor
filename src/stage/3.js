$.fn.Stage3D = function(param) {


    /**
     * 向外部派发onCameraChange事件，并输出摄像机配置信息
     */
    function outputCamera() {
        if (!_event["onCameraChange"]) return;
        _event["onCameraChange"](
            _camera.position,
            _cameraLookAt,
            {
                r: 5000 - _cameraRadius,
                b: 5000,
                a: 50
            }
        );
    }


    /***外部接口***/
    /**
     * 向舞台中添加物体
     * @param {Object} geo 3D物体对象
     */
    _this.addGeometry = function(geo) {
        if (_children[geo.tid]) return false;
        _children[geo.tid] = geo;
        _scene.add(geo);
    }
    /**
     * 从舞台中删除物体
     * @param {Object} geo 3D物体对象
     */
    _this.removeGeometry = function(geo) {
        _scene.remove(geo);
        delete _children[geo.tid];
    }
    /**
     * 获取鼠标下的物体
     * @param {Array} arr 物体数组，如果指定就从数组中查找，不指定从全局查找
     * @param {Object} e 鼠标事件对象
     * @return {Object} 3D物体对象 或null
     */
    _this.selectGeometry = function(arr,e) {
        var array = [];
        if (arr instanceof Array) {
            array = arr;
        } else {
            for (var key in _children) {
                if (_children[key].visible) array.push(_children[key]);
            }
        }
        if (array.length == 0) return null;
        var offset = _this.offset();
        var x = ((e.clientX - offset.left) / _width);
        var y = ((e.clientY - offset.top + document.body.scrollTop) / _height)
        _mouse2d.x = x * 2 - 1;
        _mouse2d.y = -y * 2 + 1;
        _mouse2d.z = 0.5;
        _mouse2d.unproject(_camera);
        _raycaster.ray.set(
            _camera.position, 
            _mouse2d.sub(_camera.position).normalize()
        );
        var intersects = _raycaster.intersectObjects(array);
        if (intersects.length > 0) {
            return intersects[0].object;
        } else {
            return null;
        }
    }

    /**
     * 设置编辑器背景色
     * @param {string} c CSS形式颜色，如红色：#FF0000
     */
    _this.setRendererColor = function(c) {
        _renderer.setClearColor(parseInt(c.substr(1), 16));
    }

    /**
     * 设置网格颜色
     * @param {string} e CSS颜色
     */
    _this.setGridColor = function(e) {
        _gridColor = parseInt(e.substr(1), 16);
        _grid.setColors(_gridColor, _gridColor);
    }
    