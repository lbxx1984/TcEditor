/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {



    var React = require('react');   
    var DropDownList = require('fcui2/DropDownList.jsx');
    var _ = require('underscore');


    return React.createClass({
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onClick: function (e) {
            var value = e.target.value;
            // 工具类命令
            if (value.indexOf(';tool') > -1) {
                this.context.dispatch('changeSystemTool', value.replace(';tool', ''));
                return;
            }
            // 一次性执行命令
            if (value.indexOf('view-') === 0) {
                this.context.dispatch('changePanelConfig', value);
                return;
            }
            this.context.dispatch(e.target.value);
        },
        render: function () {
            return (
                <div className="tc-menu" style={this.props.style}>
                    {menuFactory(this)}
                </div>
            );
        }
    });


    function menuFactory(me) {
        var doms = [];
        var panelHash = {};
        me.props.panel.map(function (panel) {
            panelHash[panel.type] = true;
        });
        me.props.menu.map(function (menu) {
            var props = {
                key: 'menu-' + menu.label,
                label: menu.label,
                datasource: menu.children,
                onClick: me.onClick,
                itemRenderer: require('./renderer/MenuListItem.jsx')
            };
            if (menu.key === 'view') {
                props.datasource = menu.children.map(function (listItem) {
                    return _.extend({}, listItem, {
                        checked: panelHash.hasOwnProperty(listItem.key)
                    });
                });
            }
            doms.push(<DropDownList {...props}/>);
        });
        return doms;
    }


});
