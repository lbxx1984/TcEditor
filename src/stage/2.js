
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
     * 根据id获取2D物体
     * @param {number} id 物体id
     * @return {Object} 2D物体对象
     */
    _this.getMesh = function(id) {
        return _meshes[id];
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
    /**
     * 获取辅助控制器绘板
     * @return {Object} svg绘图接口，Raphael
     */
    _this.svgContent = function() {
        return _helperCTX;
    }




    /**
     * 获取舞台的颜色配制
     * @param {string|Array} type 颜色类型
     *      select：物体选中状态下的颜色
     *      hover：物体在鼠标下的颜色
     *      null：[当前横轴颜色、当前纵轴颜色]
     */
    _this.getColor = function(type) {
        if (type == "select") return _meshSelectColor;
        if (type == "hover") return _meshHoverColor;
        if (!type) {
            if (_type == "xoz") {
                return ["#ff0000", "#4285F4"];
            } else if (_type == "xoy") {
                return ["#ff0000", "#3E9B1C"];
            } else {
                return ["#3E9B1C", "#4285F4"];
            }
        }
    }


    /**
     * 只重绘舞台中的物体
     */
    _this.reDraw = function() {
        drawMeshes(_meshCTX);
    }

