/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var Dialog = require('fcui2/Dialog.jsx');
    var MeshGroupCreator = require('../components/dialogContent/MeshGroupCreator.jsx');
    var dialog = new Dialog();


    return {
        'view-xoz': function () {
            this.set('view', 'view-xoz');
        },
        'view-xoy': function () {
            this.set('view', 'view-xoy');
        },
        'view-zoy': function () {
            this.set('view', 'view-zoy');
        },
        'view-3d': function () {
            this.set('view', 'view-3d');
        },
        'view-all': function () {
            this.set('view', 'view-all');
        },
        'view-toggle-panel': function (type) {
            var panel = JSON.parse(JSON.stringify(this.get('panel')));
            panel.map(function (item) {
                if (item.type !== type) return;
                item.expend = !item.expend;
            });
            this.set('panel', panel);
        },
        'view-close-panel': function (type) {
            var panel = [];
            this.get('panel').map(function (item) {
                if (item.type === type) return;
                panel.push(item);
            });
            this.set('panel', panel);
        },
        'view-add-group': function () {
            var me = this;
            dialog.pop({
                contentProps: {
                    group: me.get('group'),
                    onEnter: function (groupname) {
                        me.set('group', [].concat(me.get('group'), [
                            {label: groupname, expend: true}
                        ]));
                    }
                },
                content: MeshGroupCreator,
                title: 'Create New Mesh Group'
            });
        },
        'view-move-group': function (id1, id2) {
            var group = [];
            var result = [];
            var moving = null;
            this.get('group').map(function (item) {
                if (item.label === id1) {
                    moving = item;
                    return;
                }
                group.push(item);
            });
            if (!moving) return;
            group.map(function (item) {
                if (item.label === id2) {
                    result.push(item);
                    result.push(moving);
                    moving = null;
                }
                else {
                    result.push(item);
                }
            });
            if (moving) return;
            this.set('group', result);
        }
    };


});
