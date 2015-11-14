define(function (require) {
    return React.createClass({
        getInitialState: function () {
            return {
                light: {},
                selected: ''
            };
        },
        render: function () {
            var lights = [];
            var me = this;
            for (var key in this.state.light) {
                if (!this.state.light.hasOwnProperty(key)) {
                    continue;
                }
                lights.push(this.state.light[key]);
            }
            var boxProp = {
                className: 'mesh-box',
                style: {
                    display: lights.length ? 'block' : 'none'
                }
            };

            function clickHandler(e) {
                var cmd = e.target.dataset.cmd || 'select';
                var uuid = e.target.dataset.light || e.target.parentNode.dataset.light;
                var cmd = 'tool-light' + cmd.replace(/(\w)/,function(v){return v.toUpperCase()}) + '-;' + uuid;
                me.props.commandRouting(cmd);
            }

            function produceLight(item) {
                var visible = 'iconfont icon-' + (item.visible ? 'kejian' : 'bukejian2');
                var locked = 'iconfont icon-' + (item.locked ? 'suo1' : 'suo');
                var title = item.type.replace('Light', '') + ' ' + new Date(item.birth).format('MM/DD hh:mm:ss');
                var lightProp = {
                    className: 'mesh-item' + (me.state.selected.indexOf(item.uuid + ';') > -1 ? ' selected' : ''),
                    'data-light': item.uuid,
                    onClick: clickHandler
                };
                return (
                    <div {...lightProp}>
                        <div data-cmd="delete" className="iconfont icon-lajixiang"></div>
                        <div data-cmd="visible" className={visible}></div>
                        <div data-cmd="lock" className={locked}></div>
                        <div className="label">{title}</div>
                    </div>
                );
            }

            return (
                <div {...boxProp}>{lights.map(produceLight)}</div>
            );
        }
    });
});
