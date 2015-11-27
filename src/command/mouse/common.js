define(function (require) {

    return {

        // 各鼠标控制器共享数据集
        _down: false,
        _mouse: [-1, -1],
        _mouse3d: [0, 0, 0],
        _lastMesh: null,

        /**
         * 绑定物体
         *
         * @param {Object} me routing对象
         * @param {Object} helper 当前工作的tool引擎，transformer或morpher
         * @param {Object3D} mesh 3D物体
         */
        attach: function (me, helper, mesh) {
            var rightContainer = me.ui.refs.containerright;
            var leftContainer = me.ui.refs.containerleft;
            me[helper].attach(mesh);
            me.stage.changeMeshColor(null, 'active');
            me.stage.changeMeshColor(mesh, 'active');
            rightContainer.refs.verticallist.refs.meshBox.setState({selected: mesh.uuid + ';'});
            leftContainer.refs.stage.setState({activeMesh: mesh});
        },

        /**
         * 解绑物体
         *
         * @param {Object} me routing对象
         * @param {Object} helper 当前工作的tool引擎，transformer或morpher
         */
        detach: function (me, helper) {
            var rightContainer = me.ui.refs.containerright;
            var leftContainer = me.ui.refs.containerleft;
            me[helper].detach();
            me.stage.changeMeshColor(null, 'active');
            rightContainer.refs.verticallist.refs.meshBox.setState({selected: ''});
            leftContainer.refs.stage.setState({activeMesh: null});
        },

        /**
         * 更新UI controlBar
         *
         * @param {Object} me routing对象
         * @param {string} key 控制栏state中的某个key
         * @param {string} value 待刷入的value
         */
        updateControlBar: function (me, key, value) {
            if (!me.ui) return;
            var controlBar = me.ui.refs.containerleft.refs.controlbar;
            if (controlBar.state[key] === value) return;
            var obj = {};
            obj[key] = value;
            controlBar.setState(obj);
        }
    };

});
