
    /***辅助函数***/



    /***外部接口***/
    /**
     * 设置物体可见性
     * @param {number} id 物体id
     * @param {boolean} value 是否可见
     */
    _this.meshVisible = function(id, value) {
        if (_meshes[id]) {
            _meshes[id].visible = value;
            drawMeshes(_meshCTX);
        }
    }
    /**
     * 获取鼠标下未锁定的物体
     * @param {Object} e 鼠标事件对象
     */
    _this.selectMeshByMouse = function (e) {
        var pos = _this.offset();
        var geo = drawMeshes(
            _meshCTX, 
            e.clientX - pos.left, 
            e.clientY - pos.top + document.body.scrollTop);
        if(geo != null){
            return _meshes[geo].geo;
        } else {
            return null;
        }
    }
    /**
     * 清除选中物体
     */
    _this.meshClearSelected = function() {
        _meshSelected = null;
        drawMeshes(_meshCTX);
    }
    /**
     * 选中物体
     * @param {number} id 物体id
     */
    _this.meshSetSelected = function(id) {
        _meshSelected = id;
        drawMeshes(_meshCTX);
    }

    /**
     * 删除物体
     * @param {number} 物体id
     */
    _this.deleteMesh = function(id) {
        if (_meshes[id]) {
            delete _meshes[id];
            drawMeshes(_meshCTX);
        }
    }
