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
        updateGroupProps: function () {
            var groups = this.state.group;
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                var meshes = this.getMeshesByGroup(group.uuid);
                if (meshes.length === 0) continue;
                group.visible = false;
                group.locked = true;
                meshes.each(function (mesh) {
                    group.locked = group.locked && mesh.locked;
                    group.visible = group.visible || mesh.visible;
                });
            }
            this.setState({group: groups});
        },
        getMeshesByGroup: function (groupUUID) {
            var result = [];
            for (var key in this.state.meshes) {
                var group = this.state.meshes[key].group;
                if (group === groupUUID || (groupUUID === 'default group' && typeof group !== 'string')) {
                    result.push(this.state.meshes[key]);
                }
            }
            return result;
        },
        setGroupProp: function (uuid, prop, value) {
            for (var i = 0; i < this.state.group.length; i++) {
                if (this.state.group[i].uuid === uuid) {
                    this.state.group[i][prop] = value;
                    break;
                }
            }
            this.setState({group: this.state.group});
        },
        getGroupProp: function (uuid, prop) {
            var value = null;
            for (var i = 0; i < this.state.group.length; i++) {
                if (this.state.group[i].uuid === uuid) {
                    value = this.state.group[i][prop];
                    break;
                }
            }
            return value;
        },
        meshOperateHandler: function (e) {
            var uuid = e.target.dataset.uuid || e.target.parentNode.dataset.uuid;
            var cmd = e.target.dataset.cmd || 'select';
            if (!uuid || cmd === 'todo' || cmd === 'group') return;
            this.props.commandRouting('modify-' + cmd, [uuid]);
            this.updateGroupProps();
        },
        groupOperateHandler: function (e) {
            var groupUUID = e.target.dataset.uuid || e.target.parentNode.dataset.uuid;
            var cmd = e.target.dataset.cmd;
            if (!groupUUID || !cmd) return;
            switch (cmd) {
                case 'delete':
                    if (groupUUID === 'default group') break;
                    var groups = [];
                    for (var i = 0; i < this.state.group.length; i++) {
                        var group = this.state.group[i];
                        if (group.uuid === groupUUID) continue;
                        groups.push(group);
                    }
                    this.setState({group: groups});
                    break;
                case 'close':
                    this.setGroupProp(groupUUID, 'close', !this.getGroupProp(groupUUID, 'close'));
                    break;
                case 'visible':
                    var visible = !this.getGroupProp(groupUUID, 'visible');
                    var meshes = this.getMeshesByGroup(groupUUID);
                    this.setGroupProp(groupUUID, 'visible', visible);
                    if (meshes.length > 0) this.props.commandRouting('modify-visible', meshes, visible);
                    break;
                case 'lock':
                    var lock = !this.getGroupProp(groupUUID, 'locked');
                    var meshes = this.getMeshesByGroup(groupUUID);
                    this.setGroupProp(groupUUID, 'locked', lock);
                    if (meshes.length > 0) this.props.commandRouting('modify-lock', meshes, lock);
                    break;
                case 'up':
                    var groups = this.state.group;
                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        if (group.uuid !== groupUUID) continue;
                        if (i === 0) break;
                        groups[i] = groups[i - 1];
                        groups[i - 1] = group;
                        break;
                    }
                    this.setState({group: groups});
                    break;
                default: break;
            }
        },
        changeGroupHandler: function (e) {
            var meshUUID = e.target.parentNode.dataset.uuid;
            var groupUUID = e.target.dataset.uuid;
            this.props.commandRouting('modify-group', meshUUID, groupUUID);
            this.updateGroupProps();
        },
        addGroupHandler: function (e) {
            var dom = this.refs.addGroup.getDOMNode();
            dom.style.display = 'inline-block';
            dom.value = '';
            dom.focus();
        },
        inputKeyHandler: function (e) {
            var value = e.target.value.trim();
            if (value.length === 0 || e.keyCode !== 13) return;
            for (var i = 0; i < this.state.group.length; i++) {
                if (this.state.group[i].name === value) return;
            }
            var groups = this.state.group;
            groups.push({name: value, uuid: ''.uuid(), close: false, visible: true, locked: false});
            this.setState({group: groups});
            this.refs.addGroup.getDOMNode().style.display = 'none';
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
                    delete mesh.group;
                    groupConf['default group'].children.push(uuid);
                }    
            }
            return (
                <div className="mesh-tree">
                    <div className="iconfont icon-xinjianwenjianjia" onClick={this.addGroupHandler}></div>
                    <input type="text" ref="addGroup" style={{display: 'none'}} onKeyUp={this.inputKeyHandler}/>
                    {this.state.group.map(produceGroup)}
                </div>
            );
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
                        <div className={move} data-cmd="todo"
                            style={{display: me.state.group.length > 1 ? 'inline-block' : 'none'}}>
                            <div className="mesh-group-list" data-uuid={uuid} onClick={me.changeGroupHandler}>
                                {me.state.group.map(procudeGroupList)}
                            </div>
                        </div>
                        <div className={visible} data-cmd="visible"></div>
                        <div className={locked} data-cmd="lock"></div>
                        <div className="label">{name}</div>
                    </div>
                );
                function procudeGroupList(item) {
                    if (item.uuid === mesh.group || (item.uuid === 'default group' && typeof mesh.group !== 'string')) {
                        return (<div style={{display: 'none'}}></div>);
                    }
                    return (<div data-uuid={item.uuid} data-cmd="group">{item.name}</div>);
                }
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
                        <div className="mesh-group" data-uuid={item.uuid} onClick={me.groupOperateHandler}>
                            <div className={del} data-cmd="delete"></div>
                            <div className={up} data-cmd="up"></div>
                            <div className={visible} data-cmd="visible"></div>
                            <div className={locked} data-cmd="lock"></div>
                            <div className={close} data-cmd="close"></div>
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
