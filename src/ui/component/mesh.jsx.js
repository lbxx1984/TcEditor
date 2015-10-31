define(function (require) {
    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var meshes = [];
            var me = this;

            for (var key in this.state) {
                if (!this.state.hasOwnProperty(key)) {
                    continue;
                }
                meshes.push(this.state[key]);
            }

            function clickHandler(e) {
                var cmd = e.target.dataset.cmd || 'select';
                var uuid = e.target.dataset.mesh || e.target.parentNode.dataset.mesh;
                var cmd = 'tool-mesh' + cmd.replace(/(\w)/,function(v){return v.toUpperCase()}) + '-;' + uuid;
                me.props.commandRouting(cmd);
            }

            function produceMesh(item) {
                var visible = 'iconfont icon-' + (item.visible ? 'kejian' : 'bukejian2');
                var locked = 'iconfont icon-' + (item.locked ? 'suo1' : 'suo');
                var title = item.geometry.type.replace('Geometry', '') + ' '
                    + new Date(item.birth).format('MM/DD hh:mm:ss');
                return (
                    <div className="mesh-item" data-mesh={item.uuid} onClick={clickHandler}>
                        <div data-cmd="delete" className="iconfont icon-lajixiang"></div>
                        <div data-cmd="visible" className={visible}></div>
                        <div data-cmd="lock" className={locked}></div>
                        <div className="label">{title}</div>
                    </div>
                );
            }

            return (
                <div className="mesh-box">{meshes.map(produceMesh)}</div>
            );
        }
    });
});