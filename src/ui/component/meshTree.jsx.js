define(function (require) {

    var config = require('config');

    return React.createClass({
        getInitialState: function () {
            return {
                meshes: {},
                selected: '',
                group: config.meshGroup
            };
        },
        render: function () {

            var me = this;
            var groupConf = {};
            for (var i = 0; i < me.state.group.length; i++) {
                var group = me.state.group[i];
                group.children = [];
                groupConf[group.uuid] = group;
            }
            console.log(groupConf);

            function produceGroup(item, index) {
                var visible = item.visible ? 'iconfont icon-kejian' : 'iconfont icon-bukejian';
                var locked = item.locked ? 'iconfont icon-suo1' : 'iconfont icon-suo';
                var close = item.close ? 'iconfont icon-wenjianjia' : 'iconfont icon-iconfont90';
                var del = item.uuid !== 'default group' ? 'iconfont icon-shanchu' : 'iconfont icon-shanchu disable';
                var up = index === 0 ? '' : 'iconfont icon-wodedingdan35';
                return (
                    <div className="mesh-group">
                        <div className={del}></div>
                        <div className={up}></div>
                        <div className={visible}></div>
                        <div className={locked}></div>
                        <div className={close}></div>
                        <div className="label">{item.name}</div>
                    </div>
                );
            } 

            return (
                <div className="mesh-tree">
                    <div className="iconfont icon-xinjianwenjianjia"></div>
                    {this.state.group.map(produceGroup)}
                </div>
            );
        }
    });
});
