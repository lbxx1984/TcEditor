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
        meshOperateHandler: function (e) {
            var uuid = e.target.dataset.uuid || e.target.parentNode.dataset.uuid;
            var cmd = e.target.dataset.cmd || 'select';
            if (!uuid || cmd === 'todo') return;
            cmd = 'tool-mesh' + cmd.replace(/(\w)/,function(v){return v.toUpperCase()});
            this.props.commandRouting(cmd, uuid);
        },
        render: function () {

            var me = this;
            var groupConf = {};
            for (var i = 0; i < me.state.group.length; i++) {
                var group = me.state.group[i];
                group.children = [];
                groupConf[group.uuid] = group;
            }
            for (var uuid in me.state.meshes) {
                var mesh = me.state.meshes[uuid];
                if (groupConf.hasOwnProperty(mesh.group)) {
                    groupConf[mesh.group].children.push(uuid);
                }
                else {
                    groupConf['default group'].children.push(uuid);
                }    
            }

            return (
                <div className="mesh-tree">
                    <div className="iconfont icon-xinjianwenjianjia"></div>
                    <input type="text" ref="addGroup" style={{display: 'none'}}/>
                    {this.state.group.map(produceGroup)}
                </div>
            );

            function procudeGroupList(item) {
                return (<div>{item.name}</div>);
            }

            function produceMesh(uuid) {
                var mesh = me.state.meshes[uuid];
                var meshClass = me.state.selected.indexOf(uuid + ';') > -1 ? 'mesh-item mesh-select' : 'mesh-item';
                var visible = mesh.visible ? 'iconfont icon-kejian' : 'iconfont icon-bukejian';
                var locked = mesh.locked ? 'iconfont icon-suo1' : 'iconfont icon-suo';
                var name = mesh.name || (mesh.geometry.type.replace('Geometry', '') + ' '
                    + new Date(mesh.birth).format('MM/DD hh:mm:ss'));
                var del = 'iconfont icon-shanchu';
                var move = 'iconfont icon-wenjianxiangguanyemiantubiao02';
                return (
                    <div className={meshClass} data-uuid={uuid} onClick={me.meshOperateHandler}>
                        <div className={del} data-cmd="delete"></div>
                        <div className={move} data-cmd="todo">
                            <div className="mesh-group-list">
                                {me.state.group.map(procudeGroupList)}
                            </div>
                        </div>
                        <div className={visible} data-cmd="visible"></div>
                        <div className={locked} data-cmd="lock"></div>
                        <div className="label">{name}</div>
                    </div>
                );
            }

            function produceGroup(item, index) {
                var visible = item.visible ? 'iconfont icon-kejian' : 'iconfont icon-bukejian';
                var locked = item.locked ? 'iconfont icon-suo1' : 'iconfont icon-suo';
                var close = item.close ? 'iconfont icon-wenjianjia' : 'iconfont icon-iconfont90';
                var del = item.uuid !== 'default group' ? 'iconfont icon-shanchu' : 'iconfont icon-shanchu disable';
                var up = index === 0 ? '' : 'iconfont icon-wodedingdan35';
                var listVisible = item.children.length > 0 && !item.close ? 'block' : 'none';
                return (
                    <div>
                        <div className="mesh-group">
                            <div className={del}></div>
                            <div className={up}></div>
                            <div className={visible}></div>
                            <div className={locked}></div>
                            <div className={close}></div>
                            <div className="label">{item.name}</div>
                        </div>
                        <div className="mesh-list" style={{display: listVisible}}>
                            {item.children.map(produceMesh)}
                        </div>
                    </div>
                );
            }
        }
    });
});
