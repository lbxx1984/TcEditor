define(function (require) {
    return React.createClass({
        getInitialState: function () {
            return {
                meshes: {},
                selected: ''
            };
        },
        render: function () {
            var meshes = [];
            var me = this;
            for (var key in this.state.meshes) {
                if (!this.state.meshes.hasOwnProperty(key)) {
                    continue;
                }
                meshes.push(this.state.meshes[key]);
            }
            var boxProp = {
                className: 'mesh-box',
                style: {
                    display: meshes.length ? 'block' : 'none'
                }
            };

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
                var meshProp = {
                    className: 'mesh-item' + (me.state.selected.indexOf(item.uuid + ';') > -1 ? ' selected' : ''),
                    'data-mesh': item.uuid,
                    onClick: clickHandler
                };
                return (
                    <div {...meshProp}>
                        <div data-cmd="delete" className="iconfont icon-lajixiang"></div>
                        <div data-cmd="visible" className={visible}></div>
                        <div data-cmd="lock" className={locked}></div>
                        <div className="label">{title}</div>
                    </div>
                );
            }

            return (
                <div {...boxProp}>{meshes.map(produceMesh)}</div>
            );
        }
    });
});