
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